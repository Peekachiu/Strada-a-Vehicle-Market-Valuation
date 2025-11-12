export class SignUpController {
  constructor(main, router) {
    this.main = main;    // The <main> element
    this.router = router;  // The app.js router
    this.form = this.main.querySelector('#signup-form'); // Find the form inside <main>

    // Bind 'this' to our handler
    this.handleSignUp = this.handleSignUp.bind(this);

    // Attach the listener
    if (this.form) {
      this.form.addEventListener('submit', this.handleSignUp);
    } else {
      console.error('Signup form not found');
    }
  }

  async handleSignUp(event) {
    event.preventDefault();

    const username = this.main.querySelector('#signup-username').value;
    const email = this.main.querySelector('#signup-email').value;
    const password = this.main.querySelector('#signup-password').value;

    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign up successful:', data);
        alert('Sign up successful! Please log in.');
        
        // Use the router to navigate to the login page
        this.router.navigate('login');
        
      } else {
        console.error('Sign up failed:', data);
        let errorMessage = 'Sign up failed. ';
        if (data.username) errorMessage += `Username: ${data.username[0]} `;
        if (data.email) errorMessage += `Email: ${data.email[0]} `;
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  // Helper function to get the CSRF cookie
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}