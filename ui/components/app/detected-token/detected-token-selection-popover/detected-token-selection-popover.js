import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18nContext } from '../../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../../contexts/metametrics';
import {
  EVENT,
  EVENT_NAMES,
} from '../../../../../shared/constants/metametrics';
import { getDetectedTokensInCurrentNetwork } from '../../../../selectors';

import Popover from '../../../ui/popover';
import Box from '../../../ui/box';
import Button from '../../../ui/button';
import DetectedTokenDetails from '../detected-token-details/detected-token-details';

const DetectedTokenSelectionPopover = ({
  tokensListDetected,
  handleTokenSelection,
  onImport,
  onIgnoreAll,
  setShowDetectedTokens,
}) => {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);

  const detectedTokens = useSelector(getDetectedTokensInCurrentNetwork);
  const detectedTokensDetails = detectedTokens.map(
    ({ address, symbol }) => `${symbol} - ${address}`,
  );

  const onClose = () => {
    setShowDetectedTokens(false);
    trackEvent({
      event: EVENT_NAMES.TOKEN_IMPORT_CANCELED,
      category: EVENT.CATEGORIES.WALLET,
      properties: {
        source: EVENT.SOURCE.TOKEN.DETECTED,
        token_count: detectedTokens.length,
        tokens: detectedTokensDetails,
      },
    });
  };

  const footer = (
    <>
      <Button
        className="detected-token-selection-popover__ignore-button"
        type="secondary"
        onClick={() => onIgnoreAll()}
      >
        {t('ignoreAll')}
      </Button>
      <Button
        className="detected-token-selection-popover__import-button"
        type="primary"
        onClick={onImport}
      >
        {t('import')}
      </Button>
    </>
  );

  return (
    <Popover
      className="detected-token-selection-popover"
      title={t('tokensFoundTitle', [detectedTokens.length])}
      onClose={onClose}
      footer={footer}
    >
      <Box margin={3}>
        {detectedTokens.map((token, index) => {
          return (
            <DetectedTokenDetails
              key={index}
              token={token}
              handleTokenSelection={handleTokenSelection}
              tokensListDetected={tokensListDetected}
            />
          );
        })}
      </Box>
    </Popover>
  );
};

DetectedTokenSelectionPopover.propTypes = {
  tokensListDetected: PropTypes.object,
  handleTokenSelection: PropTypes.func.isRequired,
  onIgnoreAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  setShowDetectedTokens: PropTypes.func.isRequired,
};

export default DetectedTokenSelectionPopover;
