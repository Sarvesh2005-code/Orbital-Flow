// src/services/realtimeService.ts
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';

export type RealtimeCallback<T> = (data: T[]) => void;
export type RealtimeUnsubscribe = () => void;

export class RealtimeService {
  // Real-time tasks listener
  static subscribeToTasks(
    userId: string, 
    callback: RealtimeCallback<any>,
    filters?: { completed?: boolean; limit?: number }
  ): RealtimeUnsubscribe {
    let q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (filters?.completed !== undefined) {
      q = query(q, where('completed', '==', filters.completed));
    }

    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    return onSnapshot(q, (snapshot) => {
      const tasks: any[] = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(tasks);
    }, (error) => {
      console.error('Real-time tasks error:', error);
    });
  }

  // Real-time habits listener
  static subscribeToHabits(
    userId: string,
    callback: RealtimeCallback<any>
  ): RealtimeUnsubscribe {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const habits: any[] = [];
      snapshot.forEach((doc) => {
        habits.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(habits);
    }, (error) => {
      console.error('Real-time habits error:', error);
    });
  }

  // Real-time notes listener
  static subscribeToNotes(
    userId: string,
    callback: RealtimeCallback<any>
  ): RealtimeUnsubscribe {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notes: any[] = [];
      snapshot.forEach((doc) => {
        notes.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(notes);
    }, (error) => {
      console.error('Real-time notes error:', error);
    });
  }

  // Real-time goals listener
  static subscribeToGoals(
    userId: string,
    callback: RealtimeCallback<any>
  ): RealtimeUnsubscribe {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const goals: any[] = [];
      snapshot.forEach((doc) => {
        goals.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(goals);
    }, (error) => {
      console.error('Real-time goals error:', error);
    });
  }

  // Real-time notifications listener
  static subscribeToNotifications(
    userId: string,
    callback: RealtimeCallback<any>
  ): RealtimeUnsubscribe {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications: any[] = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(notifications);
    }, (error) => {
      console.error('Real-time notifications error:', error);
    });
  }

  // Real-time user profile listener
  static subscribeToUserProfile(
    userId: string,
    callback: (data: any) => void
  ): RealtimeUnsubscribe {
    const userRef = doc(db, 'users', userId);

    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        });
      }
    }, (error) => {
      console.error('Real-time user profile error:', error);
    });
  }

  // Generic collection listener
  static subscribeToCollection(
    collectionName: string,
    userId: string,
    callback: RealtimeCallback<any>,
    options?: {
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      where?: { field: string; operator: any; value: any }[];
    }
  ): RealtimeUnsubscribe {
    let q = query(collection(db, collectionName));

    // Add userId filter
    q = query(q, where('userId', '==', userId));

    // Add additional where clauses
    if (options?.where) {
      for (const condition of options.where) {
        q = query(q, where(condition.field, condition.operator, condition.value));
      }
    }

    // Add order by
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
    }

    // Add limit
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (snapshot) => {
      const documents: any[] = [];
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(documents);
    }, (error) => {
      console.error(`Real-time ${collectionName} error:`, error);
    });
  }
}
