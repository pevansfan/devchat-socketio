import { Room } from '../models/room.model';

const defaultRooms = [
  {
    name: 'Général',
    slug: 'general',
  },
  {
    name: 'Tech',
    slug: 'tech',
  },
  {
    name: 'Loisirs',
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