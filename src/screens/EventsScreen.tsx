import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { apiClient } from '../api/client';
import type { EventRow, ProgramRow } from '../types';
import { Loading } from '../components/Loading';
import { Card } from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { formatDate, formatTime } from '../utils/helpers';

export const EventsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'programs'>('events');

  const loadData = async () => {
    try {
      const [eventsData, programsData] = await Promise.all([
        apiClient.getEvents(),
        apiClient.getPrograms(),
      ]);

      setEvents(eventsData);
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading events/programs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.tabActive]}
          onPress={() => setActiveTab('events')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'events' && styles.tabTextActive,
            ]}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'programs' && styles.tabActive]}
          onPress={() => setActiveTab('programs')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'programs' && styles.tabTextActive,
            ]}>
            Programs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
          />
        }>
        <View style={styles.content}>
          {activeTab === 'events' ? (
            <>
              {events.length === 0 ? (
                <Text style={styles.emptyText}>No events scheduled</Text>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <View style={styles.eventHeader}>
                      <View
                        style={[
                          styles.eventBadge,
                          event.kind === 'recurring' && styles.recurringBadge,
                        ]}>
                        <Text style={styles.eventBadgeText}>
                          {event.kind === 'recurring' ? 'RECURRING' : 'ONE-TIME'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventDate}>
                        {event.when_text ||
                          `${formatDate(event.event_date)} at ${formatTime(
                            event.event_time
                          )}`}
                      </Text>
                    </View>
                    {event.note && (
                      <Text style={styles.eventNote}>{event.note}</Text>
                    )}
                  </Card>
                ))
              )}
            </>
          ) : (
            <>
              {programs.length === 0 ? (
                <Text style={styles.emptyText}>No programs available</Text>
              ) : (
                programs.map((program) => (
                  <Card key={program.id}>
                    <Text style={styles.programTitle}>{program.title}</Text>
                    {program.grades && (
                      <View style={styles.programRow}>
                        <Text style={styles.programLabel}>Grades:</Text>
                        <Text style={styles.programValue}>{program.grades}</Text>
                      </View>
                    )}
                    {program.days && (
                      <View style={styles.programRow}>
                        <Text style={styles.programLabel}>Days:</Text>
                        <Text style={styles.programValue}>{program.days}</Text>
                      </View>
                    )}
                    {program.time && (
                      <View style={styles.programRow}>
                        <Text style={styles.programLabel}>Time:</Text>
                        <Text style={styles.programValue}>
                          {formatTime(program.time)}
                        </Text>
                      </View>
                    )}
                    {program.description && (
                      <Text style={styles.programDescription}>
                        {program.description}
                      </Text>
                    )}
                    {program.note && (
                      <Text style={styles.programNote}>{program.note}</Text>
                    )}
                  </Card>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.gold,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.ink,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    padding: SPACING.xl,
  },
  eventHeader: {
    marginBottom: SPACING.sm,
  },
  eventBadge: {
    backgroundColor: COLORS.info,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  recurringBadge: {
    backgroundColor: COLORS.success,
  },
  eventBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
  },
  eventTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  eventDetails: {
    marginBottom: SPACING.sm,
  },
  eventDate: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gold,
    fontWeight: '600',
  },
  eventNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  programTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  programRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  programLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray,
    width: 80,
  },
  programValue: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
  },
  programDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.ink,
    lineHeight: 22,
    marginTop: SPACING.md,
  },
  programNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
});
