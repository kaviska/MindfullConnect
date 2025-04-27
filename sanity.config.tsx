'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

import {NavbarProps, useWorkspace} from 'sanity'
import {Card, Stack} from '@sanity/ui'

import StudioNavbar from '@/app/components/studioNavbar'

function CustomNavbar(props: NavbarProps) {
  const {dataset} = useWorkspace()

  return (
    <Stack>
      <Card padding={0} tone="primary">
        <StudioNavbar />
      </Card>
      {props.renderDefault(props)} {/* Render the default navbar */}
    </Stack>
  )
}

export default defineConfig({
  basePath: '/studio',
  name: 'MindfulConnect',
  title: 'MindfulConnect Studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  studio: {
    theme: 'light',
    components: {
      navbar: CustomNavbar,
    },
  },
})
