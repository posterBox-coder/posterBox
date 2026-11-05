import { Icons } from '@/constants/icons';
import type { ImageSourcePropType } from 'react-native';

export type HomeAction = {
  id: 'send-package' | 'do-delivery' | 'delivery-rate' | 'contact-support';
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  width?: number;
  href: '/(home)/send-package' | '/(home)/do-delivery' | '/(home)/delivery-rate' | '/(home)/contact-support';
};

export type NotificationKind = 'delivery_request' | 'delivered';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  destination: string;
  sender: string;
  meta: string;
  trackingNo?: string;
};

export type TimelineStatus = 'completed' | 'current' | 'upcoming';

export type TimelineEvent = {
  id: string;
  date?: string;
  time?: string;
  title: string;
  subtitle?: string;
  location?: string;
  actor?: {
    name: string;
    role: string;
  };
  status: TimelineStatus;
};

export type TrackingRecord = {
  trackingNo: string;
  events: TimelineEvent[];
};

export type ActivityItem = {
  id: string;
  title: string;
  destination: string;
  status: string;
  date: string;
};

export type ScheduleItem = {
  id: string;
  title: string;
  route: string;
  date: string;
  window: string;
};

export const HOME_ACTIONS: HomeAction[] = [
  {
    id: 'send-package',
    title: 'Send Package',
    subtitle: 'Schedule your package to be delivered',
    image: Icons.homeSend as ImageSourcePropType,
    href: '/(home)/send-package',
    width: 34,
      
  },
  {
    id: 'do-delivery',
    title: 'Do Delivery',
    subtitle: 'Be Available to do Delivery',
    image: Icons.homeDelivery as ImageSourcePropType,
    href: '/(home)/do-delivery',
    width: 27,
  },
  {
    id: 'delivery-rate',
    title: 'Delivery Rate',
    subtitle: 'Get the prices of deliveries within states',
    image: Icons.homeRate as ImageSourcePropType,
    href: '/(home)/delivery-rate',
    width: 26,
  },
  {
    id: 'contact-support',
    title: 'Contact support',
    subtitle: 'Reach out to  us via various platforms.',
    image: Icons.homeSupport as ImageSourcePropType,
    href: '/(home)/contact-support',
    width: 20,
  },
];

export const CURRENT_LOCATION = 'ikeja, lagos state';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    kind: 'delivery_request',
    title: 'Request for Delivery',
    destination: 'To_ Uyo, Akwa Ibome state.',
    sender: 'Joshua Ekanem',
    meta: 'Within:10 days',
  },
  {
    id: 'n2',
    kind: 'delivery_request',
    title: 'Request for Delivery',
    destination: 'To_ Uyo, Akwa Ibome state.',
    sender: 'Joshua Ekanem',
    meta: 'Within:10 days',
  },
  {
    id: 'n3',
    kind: 'delivered',
    title: 'package has been delivered',
    destination: 'To_ Uyo, Akwa Ibome state.',
    sender: 'Joshua Ekanem',
    meta: '25/05/2025',
    trackingNo: 'AKS-1234567890',
  },
];

export const MOCK_TRACKING: Record<string, TrackingRecord> = {
  'TRX-98472-FGH23': {
    trackingNo: 'TRX-98472-FGH23',
    events: [
      {
        id: 't1',
        date: '10.Aug.2022',
        time: '01:20pm',
        title: 'The Package has been picked up',
        subtitle: 'Picked up by',
        actor: { name: 'Thomas MD.', role: 'Rider' },
        location: 'Abuja',
        status: 'completed',
      },
      {
        id: 't2',
        title: 'The Package is on the way to Uyo',
        subtitle: 'In transit',
        status: 'current',
      },
      {
        id: 't3',
        date: '12.Aug.2022',
        time: '04:10pm',
        title: 'The Package has been Delivered',
        location: 'Akwa Ibom',
        status: 'upcoming',
      },
    ],
  },
  'AKS-1234567890': {
    trackingNo: 'AKS-1234567890',
    events: [
      {
        id: 'a1',
        date: '10.Aug.2022',
        time: '01:20pm',
        title: 'The Package has been picked up',
        subtitle: 'Picked up by',
        actor: { name: 'Thomas MD.', role: 'Rider' },
        location: 'Abuja',
        status: 'completed',
      },
      {
        id: 'a2',
        title: 'The Package is on the way to Uyo',
        subtitle: 'In transit',
        status: 'current',
      },
      {
        id: 'a3',
        date: '10.Aug.2022',
        time: '01:20pm',
        title: 'The Package has been Delivered',
        location: 'Akwa Ibom',
        status: 'completed',
      },
    ],
  },
};

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act1',
    title: 'Delivery to Uyo',
    destination: 'Akwa Ibom state',
    status: 'In transit',
    date: '12 Oct 2026',
  },
  {
    id: 'act2',
    title: 'Package picked up',
    destination: 'Ikeja, Lagos state',
    status: 'Completed',
    date: '10 Oct 2026',
  },
  {
    id: 'act3',
    title: 'Request received',
    destination: 'Port Harcourt, Rivers',
    status: 'Pending',
    date: '08 Oct 2026',
  },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch1',
    title: 'Lagos to Uyo',
    route: 'Ikeja → Uyo',
    date: '15 Oct 2026',
    window: 'Morning',
  },
  {
    id: 'sch2',
    title: 'Abuja to Enugu',
    route: 'Abuja → Enugu',
    date: '18 Oct 2026',
    window: 'Afternoon',
  },
];
