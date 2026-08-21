import { Room } from '../models/room.model';

const defaultRooms = [
  {
    name: 'Général',
    description: 'Espace de discussion générale',
    slug: 'general',
  },
  {
    name: 'Tech',
    description: 'Discutez de technologie et de développement',
    slug: 'tech',
  },
  {
    name: 'Loisirs',
    description: 'Partagez vos passions et vos loisirs',
    slug: 'loisirs',
  },
];

export async function seedRooms() {
  for (const room of defaultRooms) {
    await Room.findOrCreate({
      where: {
        slug: room.slug,
      },
      defaults: room,
    });
  }

  console.log('✅ Salons par défaut chargés');
}