import { PrismaClient } from '@prisma/client';

export async function deleteCart(id: string) {
  const prisma = new PrismaClient();

  return await prisma.cart.delete({
    where: {
      id,
    },
  });
}
