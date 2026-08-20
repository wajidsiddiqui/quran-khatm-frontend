import { useEffect, useState } from "react";
import {
  Bell,
  X,
  BookOpen,
  Users,
  CheckCircle2,
  BellOff,
} from "lucide-react";

export default function HomeHeader({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // Fetch unread notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setNotifications([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Notifications response:",
        data
      );

      if (data.success) {
        setNotifications(data.data || []);
      } else {
        console.error(
          "Failed to fetch notifications:",
          data
        );

        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAsRead(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          "No authentication token found"
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Read-all response:",
        data
      );

      if (data.success) {
        setNotifications([]);
        setIsOpen(false);
      } else {
        console.error(
          "Failed to mark notifications as read:",
          data
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark notifications as read:",
        error
      );
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Fetch notifications when component loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Open / close notification dropdown
  const handleNotificationClick = () => {
    setIsOpen((previous) => {
      const next = !previous;

      if (next) {
        fetchNotifications();
      }

      return next;
    });
  };

  // Get notification icon
  const getNotificationIcon = (action) => {
    switch (action) {
      case "joined":
        return Users;

      case "claimed":
        return BookOpen;

      case "completed":
        return CheckCircle2;

      default:
        return Bell;
    }
  };

  /*
    IMPORTANT:
    Backend message ko use nahi kar rahe.

    Hume exact format chahiye:

    Para 10 completed
    Completed by Asres

    Para 11 claimed
    Claimed by Asres
  */
  const getNotificationContent = (notification) => {
    const userName =
      notification.user?.name ||
      notification.actor?.name ||
      "A member";

    const paraNumber = notification.para;

    switch (notification.action) {
      case "joined":
        return {
          title: `${userName} joined the Khatm`,
          message: `Joined by ${userName}`,
        };

      case "claimed":
        return {
          title: `Para ${paraNumber} claimed`,
          message: `Claimed by ${userName}`,
        };

      case "completed":
        return {
          title: `Para ${paraNumber} completed`,
          message: `Completed by ${userName}`,
        };

      default:
        return {
          title:
            notification.title ||
            "New Khatm activity",

          message:
            notification.message ||
            "There is a new update.",
        };
    }
  };

  // Format notification time
  const getTimeAgo = (date) => {
    if (!date) {
      return "";
    }

    const now = new Date();
    const activityDate = new Date(date);

    const difference =
      now.getTime() -
      activityDate.getTime();

    const seconds = Math.floor(
      difference / 1000
    );

    const minutes = Math.floor(
      seconds / 60
    );

    const hours = Math.floor(
      minutes / 60
    );

    const days = Math.floor(
      hours / 24
    );

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return activityDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  return (
    <div className="flex items-center justify-between mb-6 relative">

      {/* Greeting */}
      <div>
        <p className="text-ink-soft text-[15px]">
          Assalamu Alaikum 👋
        </p>

        <h1 className="font-display text-xl font-semibold text-ink mt-0.5">
          Good to see you again, {name}
        </h1>
      </div>

      {/* Notification */}
      <div className="relative">

        <button
          onClick={handleNotificationClick}
          className="relative w-11 h-11 rounded-full bg-cream-card border border-emerald-deep/10 flex items-center justify-center shrink-0 ml-3 hover:bg-emerald-soft transition-colors"
          aria-label="Notifications"
        >
          <Bell
            size={18}
            className="text-emerald-deep"
          />

          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold border border-cream-card" />
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-[320px] max-w-[calc(100vw-40px)] bg-cream-card border border-emerald-deep/10 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-up">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-deep/10">

              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Notifications
                </h3>

                <p className="text-xs text-ink-soft mt-0.5">
                  Stay updated with your Khatm
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-soft transition-colors"
                aria-label="Close notifications"
              >
                <X
                  size={17}
                  className="text-ink-soft"
                />
              </button>

            </div>

            {/* Notifications */}
            <div className="max-h-[430px] overflow-y-auto">

              {loading ? (

                <div className="px-4 py-10 text-center">
                  <p className="text-sm text-ink-soft">
                    Loading notifications...
                  </p>
                </div>

              ) : notifications.length === 0 ? (

                <div className="px-4 py-10 text-center">

                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-soft flex items-center justify-center">

                    <BellOff
                      size={20}
                      className="text-emerald-deep"
                    />

                  </div>

                  <p className="text-sm font-semibold text-ink">
                    No notifications yet
                  </p>

                  <p className="text-xs text-ink-soft mt-1">
                    Khatm updates will appear here.
                  </p>

                </div>

              ) : (

                notifications.map((notification) => {
                  const Icon =
                    getNotificationIcon(
                      notification.action
                    );

                  const content =
                    getNotificationContent(
                      notification
                    );

                  return (
                    <div
                      key={notification._id}
                      className="flex gap-3 px-4 py-4 hover:bg-emerald-soft/50 transition-colors border-b border-emerald-deep/5 last:border-0"
                    >

                      {/* Activity Icon */}
                      <div className="w-10 h-10 rounded-xl bg-emerald-soft flex items-center justify-center shrink-0">

                        <Icon
                          size={18}
                          className="text-emerald-deep"
                        />

                      </div>

                      {/* Activity Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <p className="text-sm font-semibold text-ink leading-snug">
                            {content.title}
                          </p>

                          <span className="text-[10px] text-ink-soft whitespace-nowrap pt-0.5">
                            {getTimeAgo(
                              notification.createdAt
                            )}
                          </span>

                        </div>

                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          {content.message}
                        </p>

                      </div>

                    </div>
                  );
                })

              )}

            </div>

            {/* Footer */}
            {notifications.length > 0 && (

              <div className="px-4 py-3 border-t border-emerald-deep/10">

                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAsRead}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-emerald-deep hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  <CheckCircle2 size={15} />

                  {markingAsRead
                    ? "Marking as read..."
                    : "Mark all as read"}

                </button>

              </div>

            )}

          </div>
        )}

      </div>

    </div>
  );
}