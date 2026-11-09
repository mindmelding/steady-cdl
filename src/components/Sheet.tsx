import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';

/**
 * Bottom sheet (Source card, Report a mistake). A tap outside it, or the Close button the
 * caller puts inside, dismisses it. Content scrolls, so it never truncates at large text.
 */
export function Sheet({
  visible,
  onClose,
  children,
  closeLabel,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
}) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={{ flex: 1 }}
        />
        <SafeAreaView
          edges={['bottom']}
          style={{
            maxHeight: '88%',
            backgroundColor: theme.color.bg,
            borderTopLeftRadius: theme.radius.sheet,
            borderTopRightRadius: theme.radius.sheet,
            borderWidth: theme.border.strong,
            borderBottomWidth: 0,
            borderColor: theme.color.ink,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: theme.space.page,
              paddingBottom: 12,
              gap: theme.space.gap,
            }}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
