import { createClient } from 'next-sanity'
import ImageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

const builder = ImageUrlBuilder(client)

export const urlFor = (source: any) => {
  return builder.image(source);
}