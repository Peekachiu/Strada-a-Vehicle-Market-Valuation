# Deploy Database Script
# 1. Dumps local data
# 2. Uploads to S3
# 3. Triggers import on EC2 via SSM

$ErrorActionPreference = "Stop"

Write-Host ">>> Step 1: Exporting Local Data..."
cd ../backend
python manage.py dumpdata --natural-foreign --natural-primary --exclude contenttypes --exclude auth.permission --exclude admin.logentry --exclude sessions.session --indent 2 > strada_database.json
if ($LASTEXITCODE -ne 0) {
    Write-Error "Dumpdata failed!"
    exit 1
}
cd ../terraform

Write-Host ">>> Step 2: Getting Terraform Outputs..."
# We use -json to parse reliably
$tfOutput = terraform output -json | ConvertFrom-Json
$bucketName = $tfOutput.s3_bucket_name.value
$asgName = $tfOutput.api_asg_name.value

Write-Host "   Bucket: $bucketName"
Write-Host "   ASG: $asgName"

Write-Host ">>> Step 3: Uploading to S3..."
aws s3 cp ../backend/strada_database.json "s3://$bucketName/db_dump/strada_database.json"

Write-Host ">>> Step 4: Finding API Instance..."
# Get an instance ID from the Auto Scaling Group
$instanceId = aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names $asgName --query "AutoScalingGroups[0].Instances[0].InstanceId" --output text

if (-not $instanceId -or $instanceId -eq "None") {
    Write-Error "No instances found in ASG!"
    exit 1
}
Write-Host "   Target Instance: $instanceId"

Write-Host ">>> Step 5: Triggering Import on EC2..."
$commands = @(
    "aws s3 cp s3://$bucketName/db_dump/strada_database.json /tmp/strada_database.json",
    "docker_id=`sudo docker ps -q --filter ancestor=peekachiu/strada-backend:latest | head -n 1`",
    "if [ -z `"$docker_id`" ]; then echo `'Backend container not found!`'; exit 1; fi",
    "sudo docker cp /tmp/strada_database.json $docker_id:/app/strada_database.json",
    "sudo docker exec $docker_id python manage.py migrate",
    "sudo docker exec $docker_id python manage.py loaddata strada_database.json",
    "rm /tmp/strada_database.json"
)

$commandId = aws ssm send-command `
    --instance-ids $instanceId `
    --document-name "AWS-RunShellScript" `
    --parameters commands="$($commands -join ' && ')" `
    --query "Command.CommandId" `
    --output text

Write-Host "   Command Sent! ID: $commandId"
Write-Host "   Waiting for execution..."

aws ssm wait command-executed --command-id $commandId --instance-id $instanceId

# Get detailed output
$output = aws ssm get-command-invocation --command-id $commandId --instance-id $instanceId --query "StandardOutputContent" --output text
$error = aws ssm get-command-invocation --command-id $commandId --instance-id $instanceId --query "StandardErrorContent" --output text

Write-Host ">>> Output:"
Write-Host $output
if ($error) {
    Write-Host ">>> Errors:" -ForegroundColor Red
    Write-Host $error
}

Write-Host ">>> Done!"
