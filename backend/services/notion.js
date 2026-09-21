const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const clientToDbMap = {
  'roca-demo': process.env.ROCA_DEMO_DB_ID || '66e2b35b-df9c-416f-a7c5-e0b6a93623a8'
};

const getDbId = (client) => {
  const dbId = clientToDbMap[client];
  if (!dbId) {
    throw new Error(`Client ${client} not configured.`);
  }
  return dbId;
};

const mapNotionToPost = (page) => {
  const props = page.properties;
  
  const title = props['Título']?.title?.[0]?.plain_text || '';
  const pillar = props['Formato']?.select?.name || '';
  const date = props['Fecha de publicación']?.date?.start || '';
  const caption = props['Copy / Descripción']?.rich_text?.[0]?.plain_text || '';
  const canvaEmbed = props['Diseño Canva']?.url || '';
  const orden = props['Orden']?.number || 0;
  
  let media = [];
  if (props['Miniatura']?.files?.length > 0) {
    media = props['Miniatura'].files.map(f => ({
      type: 'image',
      src: f.file?.url || f.external?.url || ''
    }));
  }

  return {
    id: page.id,
    title,
    pillar,
    date,
    caption,
    canvaEmbed,
    orden,
    media
  };
};

const mapPostToNotion = (post) => {
  const props = {};
  
  if (post.title !== undefined) {
    props['Título'] = { title: [{ text: { content: post.title } }] };
  }
  if (post.pillar !== undefined) {
    props['Formato'] = { select: { name: post.pillar } };
  }
  if (post.date !== undefined) {
    props['Fecha de publicación'] = { date: post.date ? { start: post.date } : null };
  }
  if (post.caption !== undefined) {
    props['Copy / Descripción'] = { rich_text: [{ text: { content: post.caption } }] };
  }
  if (post.canvaEmbed !== undefined) {
    props['Diseño Canva'] = { url: post.canvaEmbed || null };
  }
  if (post.orden !== undefined) {
    props['Orden'] = { number: post.orden };
  }

  return props;
};

const getPosts = async (client) => {
  const dbId = getDbId(client);
  const response = await notion.databases.query({
    database_id: dbId,
    // Note: sorting handled by client or add here if needed:
    // sorts: [{ property: 'Orden', direction: 'ascending' }]
  });
  return response.results.map(mapNotionToPost);
};

const updatePost = async (pageId, updates) => {
  const properties = mapPostToNotion(updates);
  const response = await notion.pages.update({
    page_id: pageId,
    properties
  });
  return mapNotionToPost(response);
};

const createPost = async (client, postData) => {
  const dbId = getDbId(client);
  const properties = mapPostToNotion(postData);
  
  const response = await notion.pages.create({
    parent: { database_id: dbId },
    properties
  });
  return mapNotionToPost(response);
};

module.exports = {
  getPosts,
  updatePost,
  createPost
};
