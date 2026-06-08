import admin from 'firebase-admin';

export class FirebaseAuthAdapter {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  async verifyToken(idToken) {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  }

  async createUser(email, password) {
    return await admin.auth().createUser({ email, password });
  }

  async deleteUser(uid) {
    return await admin.auth().deleteUser(uid);
  }
}