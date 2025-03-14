import * as React from 'react';
import { CamelIntegrationKind } from "../../types"
import { Card, CardBody, CardTitle, TextContent } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { camelIntegrationGVK, getCamelIntegrationVersion, getBuildTimestamp } from '../../utils';

type CamelIntegrationDetailsProps = {
    obj: CamelIntegrationKind;
};

const CamelIntegrationDetails: React.FC<CamelIntegrationDetailsProps> = ({ obj: camelInt }) => {
    console.log("+++CamelIntegrationDetails");
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');


    console.log("is camelInt there?");
    console.log(typeof camelInt);
    console.log("detail");
    console.log(camelInt);

    const groupVersionKind = camelIntegrationGVK(camelInt.kind);
    const version = getCamelIntegrationVersion(camelInt);
    const buildTimestamp = getBuildTimestamp(camelInt);


    return (
        <Card>
            <CardTitle>{t('Integration')}</CardTitle>
            <CardBody>
                <Card>
                    <CardTitle>Details</CardTitle>
                    <CardBody>

                        <ResourceLink
                            groupVersionKind={groupVersionKind}
                            name={camelInt.metadata.name}
                            namespace={camelInt.metadata.namespace}
                            linkTo={true}
                        />
                        {version && (
                            <TextContent>
                                <strong>Version:</strong> {version}
                            </TextContent>
                        )}
                        {buildTimestamp && (
                            <TextContent>
                                <strong>Build Timestamp:</strong> {buildTimestamp}
                            </TextContent>
                        )}
                    </CardBody>
                </Card>

            </CardBody>
        </Card>
    );

}

export default CamelIntegrationDetails