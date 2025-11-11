/**
 * A service to manage all Firebase authentication tasks.
 */

// We'll hold the auth instance here
let auth;

/**
 * Initializes the Firebase Auth service and signs in the user.
 * Must be called once when the app loads.
 */
export async function initAuth() {
  if (!window.firebase) {
    console.error("Firebase is not loaded. Auth cannot be initialized.");
    return null;
  }
  
  auth = firebase.auth();
  
  // Sign in using the token provided by the environment
  try {
    const token = window.__initial_auth_token;
    if (token) {
      await auth.signInWithCustomToken(token);
    } else {
      // Fallback for local dev or if no token is provided
      await auth.signInAnonymously();
    }
    console.log("Auth initialized, user signed in.");
    return auth.currentUser;
  } catch (error) {
    console.error("Firebase sign-in error:", error);
    return null;
  }
}

/**
 * Attaches a listener that fires when the auth state changes (login/logout).
 * @param {function} callback - The function to call with the new user object (or null).
 */
export function onAuthStateChanged(callback) {
  if (!auth) return;
  auth.onAuthStateChanged(callback);
}

/**
 * Signs up a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
export async function signUp(email, password, fullName) {
  if (!auth) throw new Error("Auth not initialized.");
  
  // Create the user
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  
  // Add their full name to their profile
  if (userCredential.user) {
    await userCredential.user.updateProfile({
      displayName: fullName
    });
    
    // We also save it to Firestore for our backend to use (optional but good practice)
    const db = firebase.firestore();
    await db.collection("users").doc(userCredential.user.uid).set({
      uid: userCredential.user.uid,
      email: email,
      displayName: fullName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  return userCredential.user;
}

/**
 * Logs in an existing user.
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  if (!auth) throw new Error("Auth not initialized.");
  
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  return userCredential.user;
}

/**
 * Logs the current user out.
 */
export function logout() {
  if (!auth) return;
  return auth.signOut();
}

/**
 * Checks if the current user is a "real" user (not anonymous).
 */
export function isUserLoggedIn(user) {
  return user && !user.isAnonymous;
}