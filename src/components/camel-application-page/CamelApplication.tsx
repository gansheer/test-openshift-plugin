import { PageSection, Title } from '@patternfly/react-core';
import { useParams } from 'react-router-dom-v5-compat';
import * as React from 'react';


const CamelApplication: React.FC = () => {
    const {
        name,
        ns: namespace,
        kind,
      } = useParams<{
        ns?: string;
        name?: string;
        kind?: string;
      }>();

    return (<>
        <PageSection variant="light">
            <Title headingLevel="h1">There will be something here soon</Title>
            {namespace} - {kind} - {name}
        </PageSection>
    </>);
};

export default CamelApplication;