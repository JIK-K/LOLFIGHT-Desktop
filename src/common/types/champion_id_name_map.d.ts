// src/types/champion_id_name_map.d.ts

interface ChampionsMap {
  [key: string]: string;
}

declare module "*.json" {
  const value: ChampionsMap;
  export default value;
}
