import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const getOrder = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, ...orderData } = req.body;

        // Generate order code if not provided
        if (!orderData.orderCode) {
            orderData.orderCode = `ORD-${Date.now().toString().slice(-6)}`;
        }

        const order = await prisma.order.create({
            data: {
                ...orderData,
                items: {
                    create: items
                }
            },
            include: { items: true }
        });

        // Update product stock (simple version, assuming stock management needed)
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

export const updateOrder = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { items, ...orderData } = req.body;

        // This is a simplified update. Complex updates typically require transaction logic 
        // to handle item changes and stock adjustments.
        const order = await prisma.order.update({
            where: { id },
            data: orderData
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order' });
    }
};

export const deleteOrder = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.order.delete({ where: { id } });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order' });
    }
};
