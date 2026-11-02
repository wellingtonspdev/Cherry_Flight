import React, { memo, useId, useMemo } from 'react';
import { SvgAst } from 'react-native-svg';
import { vectorRegistry } from '../game/assetPreloaderV2';
import { scopeVectorIds } from '../game/vectorIdsV2';

export default memo(function VectorAssetV2({ assetKey, width, height, viewportWidth = 0, viewportHeight = 0, part = '', viewBox, stretch = false, opacity = 1 }) {
  const asset = vectorRegistry.get(assetKey, viewportWidth, viewportHeight, part);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ast = useMemo(() => scopeVectorIds(asset.ast, id), [asset.ast, id]);
  return <SvgAst ast={ast} override={{ width, height, ...(viewBox ? { viewBox } : {}), preserveAspectRatio: stretch ? 'none' : 'xMidYMid meet', opacity, pointerEvents: 'none' }} />;
});
