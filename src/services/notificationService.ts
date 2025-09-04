// src/services/notificationService.ts
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface NotificationData {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_deadline' | 'habit_reminder' | 'general' | 'achievement';
  isRead: boolean;
  createdAt?: any;
  scheduledFor?: Date;
  relatedId?: string; // Task ID, habit ID, etc.
}

export class NotificationService {
  // Request permission for push notifications
  static async requestPermission(): Promise<string | null> {
    if (!messaging) {
      console.warn('Messaging not supported in this browser');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        
        if (token) {
          console.log('Registration token:', token);
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting permission:', error);
      return null;
    }
  }

  // Save FCM token to user document
  static async saveFCMToken(userId: string, token: string) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  // Listen to foreground messages
  static onMessage(callback: (payload: any) => void) {
    if (!messaging) return () => {};
    
    return onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  }

  // Create a notification document in Firestore
  static async createNotification(notificationData: Omit<NotificationData, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: new Date(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get user notifications
  static async getUserNotifications(userId: string, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: NotificationData[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        } as NotificationData);
      });
      
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Schedule deadline reminder
  static async scheduleDeadlineReminder(
    userId: string, 
    taskId: string, 
    title: string, 
    dueDate: Date
  ) {
    // Schedule for 1 day before deadline
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    
    // Only schedule if deadline is in the future
    if (reminderDate > new Date()) {
      await this.createNotification({
        userId,
        title: 'Deadline Reminder',
        message: `Task "${title}" is due tomorrow!`,
        type: 'task_deadline',
        isRead: false,
        scheduledFor: reminderDate,
        relatedId: taskId,
      });
    }
  }

  // Show browser notification
  static showBrowserNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icons/orbital-flow-logo.png',
        badge: '/icons/orbital-flow-logo.png',
        ...options,
      });
    }
  }

  // Send habit reminder notification
  static async sendHabitReminder(userId: string, habitName: string) {
    await this.createNotification({
      userId,
      title: 'Habit Reminder',
      message: `Time to complete your "${habitName}" habit!`,
      type: 'habit_reminder',
      isRead: false,
    });

    this.showBrowserNotification('Habit Reminder', {
      body: `Time to complete your "${habitName}" habit!`,
    });
  }

  // Send achievement notification
  static async sendAchievementNotification(
    userId: string, 
    achievement: string
  ) {
    await this.createNotification({
      userId,
      title: 'Achievement Unlocked! 🎉',
      message: achievement,
      type: 'achievement',
      isRead: false,
    });

    this.showBrowserNotification('Achievement Unlocked! 🎉', {
      body: achievement,
    });
  }
}
