import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ALL_NAMESPACES_KEY } from '../../const';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';


type CamelIntegrationTitleProps = {
    name: string;
    namespace: string;
};

export const getUrlList = (namespace): string => {
    if (namespace === ALL_NAMESPACES_KEY) {
        return `/camel/all-namespaces`;
    } else {
        return `/camel/ns/` + namespace
    }
}

const CamelIntegrationTitle: React.FC<CamelIntegrationTitleProps> = ({ name }) => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    
    const [activeNamespace, _] = useActiveNamespace();
    
    return (
        <>
            <div className="co-m-nav-title co-m-nav-title--detail">
                <div>
                    <Breadcrumb className="pf-v6-c-breadcrumb co-breadcrumb">
                        <BreadcrumbItem>
                            <Link to={getUrlList(activeNamespace)}>
                                {t('Camel')}
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>{t('Camel Details')}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <span className="co-m-pane__heading">
                    <h1 className="co-resource-item__resource-name">
                        <span
                            className="co-m-resource-icon co-m-resource-secret co-m-resource-icon--lg"
                            title="Camel"
                        >
                            {t('C')}
                        </span>
                        {name}
                    </h1>
                </span>
            </div>

        </>
    );
};

export default CamelIntegrationTitle;