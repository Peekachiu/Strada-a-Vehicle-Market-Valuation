import sys

def remove_bom(filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # Check for UTF-8 BOM (0xEF, 0xBB, 0xBF)
        if content.startswith(b'\xef\xbb\xbf'):
            print(f"Removing BOM from {filepath}...")
            content = content[3:]
            with open(filepath, 'wb') as f:
                f.write(content)
            print("Done.")
        else:
            print("No BOM found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        remove_bom(sys.argv[1])
    else:
        print("Usage: python clean_bom.py <filename>")
