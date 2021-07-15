import React from 'react'
import { Button, Card, Typography } from 'antd'
import { PageLayout } from 'containers/Layouts'
import { downloadCLI } from 'utils/analyses'

const { Text, Title, Paragraph } = Typography

export const CLIDownloadPage = () => (
  <PageLayout heading="Command Line Interface">
    <Card>
      <Typography>
        <Title level={3}>
          <div className="d-flex align-items-center">
            Instructions
            <Button icon="download" type="primary" className="ml-2" onClick={downloadCLI}>
              Download
            </Button>
          </div>
        </Title>
        <Paragraph type="danger">
          Usage: python3 brainforge.py
          <br />
          Five commands are available.
        </Paragraph>
        <Paragraph>
          <ul className="download-help">
            <li>
              <Text strong>Login to the API server</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py login
              </Text>
            </li>
            <li>
              <Text strong>Logout</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py logout
              </Text>
            </li>
            <li>
              <Text strong>Upload file to the server</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py upload local_file.nii site/pi/study/scanner/subject/session/series
              </Text>
            </li>
            <li>
              <Text strong>Download files from the server</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py download site/pi/study
              </Text>
              <br />
              <br />
              <Text>To see download</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py download --help
              </Text>
            </li>
            <li>
              <Text strong>Show help</Text>
              <br />
              <Text code copyable>
                python3 brainforge.py help
              </Text>
            </li>
          </ul>
        </Paragraph>
      </Typography>
    </Card>
  </PageLayout>
)

export default CLIDownloadPage
