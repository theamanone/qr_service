import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiMapPin, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getUserHistory, deleteHistory } from '@/utils/apiHandlers';
import InfiniteScroll from 'react-infinite-scroll-component';
import Confirm from '@/components/Confirm';

interface Activity {
  id: string;
  description: string;
  createdAt: string;
  type: string;
  metadata?: {
    ipAddress?: string;
    location?: string;
    userAgent?: string;
  };
}

interface RecentActivityProps {
  initialActivities?: Activity[];
}

export default function RecentActivity({ initialActivities = [] }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [loading, setLoading] = useState(!initialActivities.length);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const fetchActivities = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!isMounted) return;
    
    try {
      setLoading(true);
      const response = await getUserHistory(pageNum, 10);
      if (response?.success && Array.isArray(response?.data?.history)) {
        const newActivities = response.data.history;
        setActivities(prev => append ? [...prev, ...newActivities] : newActivities);
        setHasMore(newActivities.length === 10);
        setPage(pageNum);
      }
    } catch (err) {
      setError('Failed to load recent activity');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [isMounted]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchActivities(page + 1, true);
  }, [fetchActivities, hasMore, loading, page]);

  const handleDelete = async () => {
    if (!selectedActivityId) return;

    try {
      const response = await deleteHistory(selectedActivityId);
      if (response?.success) {
        setActivities(prev => prev.filter(activity => activity.id !== selectedActivityId));
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
    } finally {
      setShowConfirm(false);
      setSelectedActivityId(null);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted && !initialActivities.length) {
      fetchActivities(1, false);
    }
  }, [fetchActivities, initialActivities.length, isMounted]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return '🔍';
      case 'create':
        return '➕';
      case 'delete':
        return '🗑️';
      case 'update':
        return '✏️';
      default:
        return '📝';
    }
  };

  if (error) {
    return (
      <Card className="w-full shadow-sm">
        <CardBody className="text-center text-gray-500 py-8">
          {error}
        </CardBody>
      </Card>
    );
  }

  const renderActivityItem = (activity: Activity) => (
    <div
      key={activity.id}
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.description}
        </p>
        {activity.metadata?.location && (
          <div className="flex items-center gap-2 mt-1">
            <FiMapPin className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500 truncate">
              {activity.metadata.location}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FiClock className="w-3 h-3" />
          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            setSelectedActivityId(activity.id);
            setShowConfirm(true);
          }}
        >
          <FiTrash2 className="w-4 h-4 text-danger hover:text-danger-400" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
        <div>
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-500">Latest actions and events</p>
        </div>
      </CardHeader>
      <CardBody className="px-3">
        <div 
          className="space-y-4 overflow-auto"
          id="activityScrollContainer"
          style={{ maxHeight: '500px' }}
        >
          {loading && activities.length === 0 ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent activity</p>
          ) : (
            <InfiniteScroll
              dataLength={activities.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={
                <div className="py-4 text-center text-gray-500">
                  Loading more activities...
                </div>
              }
              scrollableTarget="activityScrollContainer"
            >
              {activities.map(renderActivityItem)}
            </InfiniteScroll>
          )}
        </div>
      </CardBody>

      {showConfirm && (
        <Confirm
          isOpen={showConfirm}
          message="Are you sure you want to delete this activity?"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedActivityId(null);
          }}
        />
      )}
    </Card>
  );
}
