import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all customers (with pagination and search)
export const getCustomers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};
        if (search) {
            where.OR = [
                { firstName: { contains: String(search), mode: 'insensitive' } },
                { lastName: { contains: String(search), mode: 'insensitive' } },
                { phone: { contains: String(search) } },
                { code: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { bookings: true }
                    }
                }
            }),
            prisma.customer.count({ where })
        ]);

        res.json({
            customers,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
};

// Get single customer
export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id: String(id) },
            include: {
                bookings: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                checkIns: {
                    orderBy: { datetime: 'desc' },
                    take: 5
                }
            }
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error });
    }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phone, email, idCard, nationality, address, notes } = req.body;

        // Generate Code (Simple implementation)
        const count = await prisma.customer.count();
        const code = `CUS-${String(count + 1).padStart(4, '0')}`;

        const customer = await prisma.customer.create({
            data: {
                code,
                firstName,
                lastName,
                phone,
                email,
                idCard,
                nationality: nationality || 'Thai',
                address,
                notes
            }
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, email, idCard, nationality, address, notes } = req.body;

        const customer = await prisma.customer.update({
            where: { id: String(id) },
            data: {
                firstName,
                lastName,
                phone,
                email,
                idCard,
                nationality,
                address,
                notes
            }
        });

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error });
    }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({ where: { id: String(id) } });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error });
    }
};
