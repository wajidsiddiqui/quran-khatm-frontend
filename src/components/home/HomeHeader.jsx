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

  const API_URL = "http://localhost:5000/api";

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
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

  // Create notification title
  const getNotificationTitle = (notification) => {
    const userName =
      notification.user?.name || "Someone";

    switch (notification.type) {
      case "joined":
        return `${userName} joined the Khatm`;

      case "claimed":
        return `${userName} claimed Para ${notification.para}`;

      case "completed":
        return `${userName} completed Para ${notification.para}`;

      default:
        return "New Khatm activity";
    }
  };

  // Create notification message
  const getNotificationMessage = (notification) => {
    const khatmName =
      notification.khatm?.name ||
      notification.khatm?.dedicatedTo ||
      "your Khatm";

    switch (notification.type) {
      case "joined":
        return `A new member joined ${khatmName}.`;

      case "claimed":
        return `Para ${notification.para} is now being read in ${khatmName}.`;

      case "completed":
        return `Para ${notification.para} has been completed in ${khatmName}.`;

      default:
        return "There is a new update in your Khatm.";
    }
  };

  // Format notification time
  const getTimeAgo = (date) => {
    if (!date) return "";

    const seconds = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return new Date(date).toLocaleDateString();
  };

  // Open / close notifications
  const handleNotificationClick = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      fetchNotifications();
    }
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
            <div className="max-h-[350px] overflow-y-auto">
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
                  const Icon = getNotificationIcon(
                    notification.type
                  );

                  return (
                    <div
                      key={notification.id}
                      className="flex gap-3 px-4 py-4 hover:bg-emerald-soft/50 transition-colors border-b border-emerald-deep/5 last:border-0"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-emerald-soft flex items-center justify-center shrink-0">
                        <Icon
                          size={18}
                          className="text-emerald-deep"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-ink">
                            {getNotificationTitle(notification)}
                          </p>

                          <span className="text-[10px] text-ink-soft whitespace-nowrap">
                            {getTimeAgo(
                              notification.createdAt
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          {getNotificationMessage(
                            notification
                          )}
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
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-emerald-deep hover:opacity-70 transition-opacity"
                >
                  <CheckCircle2 size={15} />
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}