// Cherry Bloom — Optional Sound & Haptics Manager
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 15)
// Rule 15.2: Audio is an enhancement, never a dependency of collision/scoring.

import { Platform } from 'react-native';

let HapticsModule = null;
try {
  // Optional safe require so Snack or minimal environments never crash if absent
  HapticsModule = require('expo-haptics');
} catch (_e) {
  HapticsModule = null;
}

export function triggerJumpFeedback(muted = false) {
  if (muted) return;
  try {
    if (HapticsModule && Platform.OS !== 'web') {
      HapticsModule.selectionAsync().catch(() => {});
    }
  } catch (_e) {
    // Ignore optional feedback error
  }
}

export function triggerScoreFeedback(muted = false) {
  if (muted) return;
  try {
    if (HapticsModule && Platform.OS !== 'web') {
      HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Light).catch(() => {});
    }
  } catch (_e) {
    // Ignore optional feedback error
  }
}

export function triggerCollisionFeedback(muted = false) {
  if (muted) return;
  try {
    if (HapticsModule && Platform.OS !== 'web') {
      HapticsModule.notificationAsync(
        HapticsModule.NotificationFeedbackType.Error
      ).catch(() => {});
    }
  } catch (_e) {
    // Ignore optional feedback error
  }
}
