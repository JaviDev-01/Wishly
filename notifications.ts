import { LocalNotifications } from "@capacitor/local-notifications";
import { Birthday } from "./types";
import { getDaysUntilBirthday } from "./utils";

export const NOTIFICATION_CHANNEL_ID = "birthday_channel";

export const NotificationService = {
  async init() {
    try {
      // Request permissions on init
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== "granted") {
        console.warn("Notification permissions not granted");
        return;
      }

      // Create a channel (Android specific)
      await LocalNotifications.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: "Cumpleaños",
        description: "Notificaciones para cumpleaños",
        importance: 5,
        visibility: 1,
        vibration: true,
      });
    } catch (e) {
      console.error("Error initializing notifications", e);
    }
  },

  async scheduleBirthdayNotification(birthday: Birthday) {
    try {
      // Calculate next occurrence
      const today = new Date();
      const currentYear = today.getFullYear();
      let nextDate = new Date(
        currentYear,
        birthday.month - 1,
        birthday.day,
        9,
        0,
        0
      ); // 9:00 AM

      if (nextDate < today) {
        nextDate.setFullYear(currentYear + 1);
      }

      // Generate a unique numeric ID from the string ID (hash)
      // We need a number for the notification ID
      const notifId = this.hashString(birthday.id);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "¡Es hoy! 🎂",
            body: `Hoy es el cumpleaños de ${birthday.name}. ¡Felicítalo/a!`,
            id: notifId,
            schedule: {
              at: nextDate,
              allowWhileIdle: true,
              repeats: true,
              every: "year",
            },
            sound: "beep.wav",
            attachments: [],
            actionTypeId: "",
            extra: {
              birthdayId: birthday.id,
            },
            channelId: NOTIFICATION_CHANNEL_ID,
          },
        ],
      });
      console.log(`Scheduled notification for ${birthday.name} at ${nextDate}`);
    } catch (e) {
      console.error("Error scheduling notification", e);
    }
  },

  async cancelBirthdayNotification(birthdayId: string) {
    const notifId = this.hashString(birthdayId);
    try {
      await LocalNotifications.cancel({ notifications: [{ id: notifId }] });
    } catch (e) {
      console.error("Error cancelling notification", e);
    }
  },

  async rescheduleAll(birthdays: Birthday[]) {
    // Cancel all pending first (to be safe, though cancel works by ID)
    // Actually, getting all pending and cancelling might be cleaner but aggressive.
    // For now, let's just schedule new ones which should overwrite same ID locally?
    // Capacitor docs say: "If a notification with the same ID works, it gets updated"

    // But good practice to clear if we did a full restore.
    // Let's just iterate and schedule.
    for (const b of birthdays) {
      await this.scheduleBirthdayNotification(b);
    }
  },

  // Helper to convert string ID to integer ID
  hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash); // Ensure positive
  },
};
