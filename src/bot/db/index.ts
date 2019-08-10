import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as path from 'path'

admin.initializeApp({
  credential: admin.credential.cert(path.resolve(__dirname, `../../secret/service-account.json`))
})

export const db = admin.firestore()