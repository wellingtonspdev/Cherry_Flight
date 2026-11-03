// Cherry Bloom — Skin Shop (BOBUX Store)
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SKINS } from '../game/skinsV2';
import { useProgress } from '../game/ProgressProviderV2';
import { audioManager } from '../game/AudioManagerV2';
import CherryPlayer from './CherryV2';
import VectorAsset from './VectorAssetV2';
import World from './WorldV2';
import CherryButton from './CherryButton';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function SkinShopV2({ navigation }) {
  const { width, height } = useWindowDimensions();
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
    <View style={styles.root}>
      <World
        biome="first_bloom"
        screenWidth={width}
        screenHeight={height}
        animatePetals
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <CherryButton
            title="← HOME"
            variant="secondary"
            accessibilityLabel="Voltar para a tela inicial"
            onPress={() => navigation.popToTop()}
            style={styles.backBtn}
          />

          <View style={styles.titleWrap}>
            <Text accessibilityRole="header" style={styles.title}>LOJA DE SKINS</Text>
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
            const isUnlockedSkin = data.unlockedSkins?.includes(skin.id);
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
                <View style={[styles.avatarCircle, isEquipped && styles.avatarCircleEquipped]}>
                  <CherryPlayer size={56} state={isEquipped ? 'celebrate' : 'idle'} skin={skin.id} />
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
                    <Text style={styles.btnTextEquipped}>✓ EQUIPADO</Text>
                  </View>
                ) : isUnlockedSkin ? (
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream50,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 248, 242, 0.92)',
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.blossom300,
    borderBottomWidth: 4,
    borderBottomColor: colors.cherryLip,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backBtn: {
    minWidth: 90,
  },
  titleWrap: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#D97706',
    borderBottomWidth: 3,
    borderBottomColor: '#B45309',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  walletText: {
    color: '#92400E',
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontSize: 13,
  },
  noticeWrap: {
    marginVertical: 6,
    padding: 8,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(254, 243, 199, 0.95)',
    borderWidth: 1.5,
    borderColor: '#D97706',
    alignItems: 'center',
  },
  noticeText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: typography.fontFamily.body,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingBottom: 28,
  },
  skinCard: {
    width: 194,
    backgroundColor: 'rgba(255, 248, 242, 0.96)',
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.blossom300,
    borderBottomWidth: 5,
    borderBottomColor: colors.cherryLip,
    padding: 12,
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  cardEquipped: {
    borderColor: colors.leaf700,
    borderBottomColor: colors.leafLip,
    backgroundColor: '#F0FDF4',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blossom200,
    marginBottom: 2,
  },
  avatarCircleEquipped: {
    borderColor: colors.leaf700,
    backgroundColor: '#DCFCE7',
  },
  skinName: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    textAlign: 'center',
  },
  skinDescription: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    color: colors.ink900,
    textAlign: 'center',
    minHeight: 26,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  skinPrice: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: '#B45309',
  },
  actionBtn: {
    width: '100%',
    minHeight: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
  },
  btnEquipped: {
    backgroundColor: '#DCFCE7',
    borderColor: colors.leaf700,
    borderBottomWidth: 3,
    borderBottomColor: colors.leafLip,
  },
  btnTextEquipped: {
    color: colors.leaf800,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnEquip: {
    backgroundColor: colors.cherry700,
    borderColor: colors.cherry700,
    borderBottomWidth: 4,
    borderBottomColor: colors.cherryLip,
  },
  btnTextEquip: {
    color: colors.cream50,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnBuy: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    borderBottomWidth: 4,
    borderBottomColor: colors.goldLip,
  },
  btnTextBuy: {
    color: '#78350F',
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  btnDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
    borderBottomWidth: 2,
    borderBottomColor: '#9CA3AF',
  },
  btnTextDisabled: {
    color: '#9CA3AF',
    fontFamily: typography.fontFamily.display,
  },
});
