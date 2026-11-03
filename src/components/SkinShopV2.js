// Cherry Bloom — Skin Shop (BOBUX Store)
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SKINS } from '../game/skinsV2';
import { useProgress } from '../game/ProgressProviderV2';
import { audioManager } from '../game/AudioManagerV2';
import CherryPlayer from './CherryV2';
import VectorAsset from './VectorAssetV2';
import { colors, radius, spacing } from '../theme/theme';

export default function SkinShopV2({ navigation }) {
  const { data, loaded, equipSkin, unlockSkin, warning } = useProgress();
  const [actionMessage, setActionMessage] = useState('');

  const handleEquip = async skinId => {
    if (!loaded) return;
    audioManager.effect('ui');
    await equipSkin(skinId);
    setActionMessage(`${SKINS[skinId]?.name || skinId} equipada!`);
  };

  const handleBuy = async skin => {
    if (!loaded) return;
    if (data.bobux < skin.price) {
      setActionMessage(`Bobux insuficientes! Você precisa de ${skin.price} Bobux.`);
      return;
    }
    const success = await unlockSkin(skin.id);
    if (success === true || success?.success) {
      audioManager.effect('unlock');
      setActionMessage(`Desbloqueado com sucesso: ${skin.name}!`);
    } else {
      setActionMessage('Não foi possível desbloquear esta skin.');
    }
  };

  const skinsList = Object.values(SKINS);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela inicial"
          onPress={() => navigation.popToTop()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← HOME</Text>
        </Pressable>

        <View style={styles.titleWrap}>
          <Text accessibilityRole="header" style={styles.title}>BOBUX SHOP</Text>
        </View>

        <View style={styles.walletBadge} accessibilityLabel={`Saldo: ${data.bobux || 0} Bobux`}>
          <VectorAsset assetKey="collectibles/bobux_coin" width={22} height={22} />
          <Text style={styles.walletText}>{data.bobux || 0} BOBUX</Text>
        </View>
      </View>

      {!!(actionMessage || warning) && (
        <View style={styles.noticeWrap}>
          <Text style={styles.noticeText}>{actionMessage || warning}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.cardsGrid}
        showsVerticalScrollIndicator={false}
      >
        {skinsList.map(skin => {
          const isUnlocked = data.unlockedSkins?.includes(skin.id);
          const isEquipped = data.equippedSkin === skin.id;
          const canAfford = data.bobux >= skin.price;

          return (
            <View
              key={skin.id}
              style={[
                styles.skinCard,
                isEquipped && styles.cardEquipped,
              ]}
            >
              <View style={styles.avatarCircle}>
                <CherryPlayer size={56} state="idle" skin={skin.id} />
              </View>

              <Text style={styles.skinName}>{skin.name}</Text>
              <Text style={styles.skinDescription}>{skin.description}</Text>

              <View style={styles.priceRow}>
                <VectorAsset assetKey="collectibles/bobux_coin" width={16} height={16} />
                <Text style={styles.skinPrice}>
                  {skin.price === 0 ? 'Grátis' : `${skin.price} BOBUX`}
                </Text>
              </View>

              {isEquipped ? (
                <View style={[styles.actionBtn, styles.btnEquipped]}>
                  <Text style={styles.btnTextEquipped}>EQUIPADO</Text>
                </View>
              ) : isUnlocked ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Equipar skin ${skin.name}`}
                  onPress={() => handleEquip(skin.id)}
                  style={[styles.actionBtn, styles.btnEquip]}
                >
                  <Text style={styles.btnTextEquip}>EQUIPAR</Text>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Comprar skin ${skin.name} por ${skin.price} Bobux`}
                  accessibilityState={{ disabled: !canAfford }}
                  disabled={!canAfford}
                  onPress={() => handleBuy(skin)}
                  style={[
                    styles.actionBtn,
                    styles.btnBuy,
                    !canAfford && styles.btnDisabled,
                  ]}
                >
                  <Text style={[styles.btnTextBuy, !canAfford && styles.btnTextDisabled]}>
                    COMPRAR
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.blossom300,
  },
  backButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.cherry700,
    backgroundColor: colors.cream50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.cherry700,
    fontWeight: '800',
    fontSize: 13,
  },
  titleWrap: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 1,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  walletText: {
    color: '#92400E',
    fontWeight: '900',
    fontSize: 13,
  },
  noticeWrap: {
    marginVertical: 8,
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderWidth: 1,
    borderColor: '#D97706',
    alignItems: 'center',
  },
  noticeText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '700',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  skinCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom300,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  cardEquipped: {
    borderColor: colors.leaf800,
    backgroundColor: '#F0FDF4',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cream50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blossom300,
    marginBottom: 4,
  },
  skinName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.cherry700,
    textAlign: 'center',
  },
  skinDescription: {
    fontSize: 11,
    color: colors.ink900,
    textAlign: 'center',
    minHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  skinPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  actionBtn: {
    width: '100%',
    minHeight: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  btnEquipped: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: colors.leaf800,
  },
  btnTextEquipped: {
    color: colors.leaf800,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnEquip: {
    backgroundColor: colors.cherry700,
  },
  btnTextEquip: {
    color: colors.cream50,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnBuy: {
    backgroundColor: '#D97706',
  },
  btnTextBuy: {
    color: '#FFFBEB',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  btnTextDisabled: {
    color: '#9CA3AF',
  },
});
