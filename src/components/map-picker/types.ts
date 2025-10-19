export type GameMode = 'bo1' | 'bo3';
export type Phase = 'setup' | 'picking';
export type Map = 'nuke' | 'inferno' | 'ancient' | 'overpass' | 'train' | 'dust' | 'mirage';
export type Side = 'T' | 'CT';

export interface MapState {
  name: Map;
  status: 'available' | 'banned' | 'picked';
  pickedBy?: 'A' | 'B';
  side?: { team: 'A' | 'B'; side: Side };
  pickOrder?: number;
}

export interface Step {
  team: string;
  action: string;
  count: number;
}

export const mapImages: Record<Map, string> = {
  nuke: 'https://cdn.poehali.dev/files/c54f9b6c-d9e9-447d-90fb-72ba490168e3.png',
  inferno: 'https://cdn.poehali.dev/files/b56a4409-13e1-4101-85c8-94dd4f614d22.png',
  ancient: 'https://cdn.poehali.dev/files/0ab9aab4-cd14-46e9-9f98-59337fb4e904.png',
  overpass: 'https://cdn.poehali.dev/files/c82e2b2c-f48c-4443-b113-d9830fcf0e21.png',
  train: 'https://cdn.poehali.dev/files/4f68fbe3-de30-439e-a4ae-ef71a5436ebd.png',
  dust: 'https://cdn.poehali.dev/files/8ac11166-e9a7-42c2-b0d4-00ddcd5f2764.png',
  mirage: 'https://cdn.poehali.dev/files/0f163a71-c0f4-46a7-a0bd-bb87c5dd6c8c.png',
};
