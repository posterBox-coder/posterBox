import { StyleSheet, View } from 'react-native';

import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import type { TrackingEvent } from '@/types';
import { formatTime, formatTimelineDate } from '@/utils/format';
import { useTheme } from '@/hooks/use-theme';

type DeliveryTimelineProps = {
  events: TrackingEvent[];
};

function visualStatus(events: TrackingEvent[], index: number) {
  const event = events[index];
  if (event.timestamp) {
    return 'completed';
  }
  const firstPending = events.findIndex((item) => !item.timestamp);
  return index === firstPending ? 'current' : 'upcoming';
}

export default function DeliveryTimeline({ events }: DeliveryTimelineProps) {
  const theme = useTheme();

  return (
    <View>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const status = visualStatus(events, index);
        const isCurrent = status === 'current';
        const isUpcoming = status === 'upcoming';

        return (
          <View key={`${event.status}-${index}`} style={styles.row}>
            <View style={styles.timeCol}>
              {event.timestamp ? (
                <>
                  <Typography size={11} textType="text2">
                    {formatTimelineDate(event.timestamp)}
                  </Typography>
                  <Typography size={13} weight="700">
                    {formatTime(event.timestamp)}
                  </Typography>
                </>
              ) : null}
            </View>

            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  {
                    borderColor: theme.primary,
                    backgroundColor: isCurrent || isUpcoming ? Palette.white : theme.primary,
                  },
                  isCurrent && styles.dotCurrent,
                  isUpcoming && { borderColor: theme.borderColor },
                ]}
              />
              {isLast ? null : <View style={[styles.line, { backgroundColor: Palette.timeline }]} />}
            </View>

            <View style={styles.content}>
              <Typography size={14} weight="600" lineHeight={20}>
                {event.title}
              </Typography>
              {event.actorName ? (
                <View style={styles.actor}>
                  <View style={styles.avatar} />
                  <View>
                    <Typography size={12} textType="text2">
                      Picked up by
                    </Typography>
                    <Typography size={13} weight="500">
                      {event.actorName}
                    </Typography>
                  </View>
                </View>
              ) : event.location && event.status === 'IN_TRANSIT' ? (
                <Typography size={12} textType="text2">
                  {event.location}
                </Typography>
              ) : null}
              {event.location && event.status !== 'IN_TRANSIT' ? (
                <Typography size={12} textType="text2">
                  {event.location}
                </Typography>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 88,
  },
  timeCol: {
    paddingTop: 2,
    width: 78,
  },
  rail: {
    alignItems: 'center',
    marginRight: 12,
    width: 18,
  },
  dot: {
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    width: 18,
    zIndex: 1,
  },
  dotCurrent: {
    borderStyle: 'dashed',
  },
  line: {
    flex: 1,
    marginTop: 2,
    width: 3,
  },
  content: {
    flex: 1,
    gap: 4,
    paddingBottom: 20,
  },
  actor: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  avatar: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    height: 24,
    width: 24,
  },
});
