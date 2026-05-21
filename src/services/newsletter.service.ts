import { db } from '../firebase/config'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

export interface NewsletterSubscriber {
  email: string
  subscribedAt: Date
  verified: boolean
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' }
    }

    // Check if email already exists
    const subscribersRef = collection(db, 'newsletters')
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()))
    const existingDocs = await getDocs(q)

    if (!existingDocs.empty) {
      return { success: false, message: 'Email already subscribed' }
    }

    // Add subscriber to Firestore
    await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      verified: false,
    })

    return { success: true, message: 'Successfully subscribed! Please check your email to confirm.' }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, message: 'An error occurred. Please try again.' }
  }
}
