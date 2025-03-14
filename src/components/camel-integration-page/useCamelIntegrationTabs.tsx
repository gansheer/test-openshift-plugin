import { useTranslation } from 'react-i18next';
import CamelIntegrationDetails from '../camel-integration-details/CamelIntegrationDetails';
import * as React from 'react';
import { CamelIntegrationKind } from 'src/types';
import { NavPage } from '@openshift-console/dynamic-plugin-sdk';

export const useCamelIntegrationTabs = (camelIntegration: CamelIntegrationKind): NavPage[] => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    return [
        {
            component: () => (
                <CamelIntegrationDetails obj={camelIntegration} />
            ),
            href: '',
            name: t('Details'),
        },
    ];
};