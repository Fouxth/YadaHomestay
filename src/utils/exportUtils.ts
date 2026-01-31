import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// Type definitions remain the same
interface BookingData {
    bookingCode: string;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
    roomName?: string;
    roomType?: string;
    roomPrice: number;
    totalAmount: number;
    paidAmount: number;
    paymentStatus: string;
    status: string;
    createdAt: string;
}

interface RevenueData {
    date: string;
    bookings: number;
    orders: number;
    total: number;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('th-TH') + ' บาท';
};

// Interface for POS receipt
export interface OrderReceiptData {
    orderId: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    date: string;
    cashier?: string;
}

// Generate POS receipt PDF using html2canvas
export const generateOrderReceipt = async (order: OrderReceiptData): Promise<void> => {
    // 1. Create a temporary container for the receipt (Receipt width ~80mm)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '100mm'; // Receipt width
    container.style.minHeight = '140mm';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.fontFamily = "'Sarabun', 'Prompt', sans-serif";
    document.body.appendChild(container);

    // 2. HTML Content
    const logoColor = '#2F5D50';

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: bold; color: ${logoColor}; margin: 0;">Yada Homestay</h1>
            <p style="font-size: 12px; color: #666; margin: 5px 0;">ใบเสร็จรับเงิน / Receipt</p>
            <p style="font-size: 12px; color: #666;">โทร: 081-234-5678</p>
        </div>

        <div style="margin-bottom: 15px; font-size: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 10px;">
            <p style="margin: 2px 0; display: flex; justify-content: space-between;">
                <span>เลขที่:</span> <span>${order.orderId}</span>
            </p>
            <p style="margin: 2px 0; display: flex; justify-content: space-between;">
                <span>วันที่:</span> <span>${order.date}</span>
            </p>
            ${order.cashier ? `<p style="margin: 2px 0; display: flex; justify-content: space-between;"><span>พนักงาน:</span> <span>${order.cashier}</span></p>` : ''}
        </div>

        <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 15px;">
            <thead>
                <tr style="border-bottom: 1px solid #ddd;">
                    <th style="text-align: left; padding: 5px 0;">รายการ</th>
                    <th style="text-align: center; padding: 5px 0;">จำนวน</th>
                    <th style="text-align: right; padding: 5px 0;">รวม</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td style="padding: 5px 0;">${item.name}</td>
                        <td style="text-align: center; padding: 5px 0;">${item.quantity}</td>
                        <td style="text-align: right; padding: 5px 0;">${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="border-top: 1px dashed #ccc; padding-top: 10px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>รวมเป็นเงิน</span>
                <span>${order.subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>ภาษี (7%)</span>
                <span>${order.tax.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 16px;">
                <span>ยอดสุทธิ</span>
                <span>${order.total.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #666;">
                <span>การชำระเงิน</span>
                <span>${order.paymentMethod}</span>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #999;">
            <p>*** ขอบคุณที่ใช้บริการ ***</p>
            <p>Thank you</p>
        </div>
    `;

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        // Use auto height based on content
        const imgWidth = 80; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, Math.max(imgHeight, 140)] // Receipt width typical 80mm
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`receipt_pos_${order.orderId}.pdf`);

    } catch (error) {
        console.error('Error generating receipt:', error);
        alert('เกิดข้อผิดพลาดในการสร้างใบเสร็จ');
    } finally {
        document.body.removeChild(container);
    }
};

// Generate booking receipt PDF using html2canvas to support Thai fonts
export const generateBookingReceipt = async (booking: BookingData): Promise<void> => {
    // 1. Create a temporary container for the receipt
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.minHeight = '297mm'; // A4 height
    container.style.backgroundColor = 'white';
    container.style.padding = '40px';
    container.style.fontFamily = "'Sarabun', 'Prompt', sans-serif"; // Use web fonts
    document.body.appendChild(container);

    // 2. HTML Content
    const logoColor = '#2F5D50';
    const goldColor = '#C2A97E';

    container.innerHTML = `
        <div style="color: ${logoColor}; text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 32px; font-weight: bold; margin: 0;">Yada Homestay</h1>
            <p style="font-size: 14px; color: #666; margin: 5px 0;">
                80 ม.1 ต.ธงชัย อ.เมือง จ.เพชรบุรี 76000<br>
                โทร: 081-234-5678 | Email: yadahomestay@gmail.com
            </p>
        </div>

        <hr style="border: none; border-top: 1px solid ${goldColor}; margin: 20px 0;">

        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 24px; color: #333; margin: 0;">ใบเสร็จรับเงิน / Receipt</h2>
            <p style="font-size: 16px; color: ${logoColor}; margin: 5px 0;">
                รหัสการจอง: <strong>${booking.bookingCode}</strong>
            </p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; color: #333;">
            <div style="width: 48%;">
                <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">ข้อมูลลูกค้า</h3>
                <p style="margin: 5px 0;"><strong>ชื่อคุณ:</strong> ${booking.guestName}</p>
                <p style="margin: 5px 0;"><strong>เบอร์โทร:</strong> ${booking.guestPhone}</p>
                ${booking.guestEmail ? `<p style="margin: 5px 0;"><strong>อีเมล:</strong> ${booking.guestEmail}</p>` : ''}
            </div>
            <div style="width: 48%;">
                <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">ข้อมูลการจอง</h3>
                <p style="margin: 5px 0;"><strong>ห้องพัก:</strong> ${booking.roomName || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>ประเภท:</strong> ${booking.roomType || 'N/A'}</p>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f8f9fa; color: ${logoColor};">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">รายการ</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">รายละเอียด</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">วันเช็คอิน</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatDate(booking.checkInDate)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">วันเช็คเอาท์</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatDate(booking.checkOutDate)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">จำนวนคืน</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${booking.nights} คืน</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">ผู้เข้าพัก</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">ผู้ใหญ่ ${booking.adults}, เด็ก ${booking.children}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 50%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 8px 0;"><strong>ราคาห้องพัก/คืน:</strong></td>
                        <td style="padding: 8px 0; text-align: right;">${formatCurrency(booking.roomPrice)}</td>
                    </tr>
                    <tr style="border-top: 1px solid #ddd;">
                        <td style="padding: 8px 0; color: ${logoColor}; font-size: 16px;"><strong>ยอดรวมทั้งหมด:</strong></td>
                        <td style="padding: 8px 0; text-align: right; color: ${logoColor}; font-size: 16px;"><strong>${formatCurrency(booking.totalAmount)}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">ชำระแล้ว:</td>
                        <td style="padding: 8px 0; text-align: right;">${formatCurrency(booking.paidAmount)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">คงเหลือ:</td>
                        <td style="padding: 8px 0; text-align: right;">${formatCurrency(booking.totalAmount - booking.paidAmount)}</td>
                    </tr>
                     <tr>
                        <td style="padding: 8px 0;">สถานะ:</td>
                        <td style="padding: 8px 0; text-align: right; color: ${booking.paymentStatus === 'paid' ? 'green' : 'orange'}; font-weight: bold;">
                            ${booking.paymentStatus === 'paid' ? 'ชำระเงินแล้ว' : 'รอชำระเงิน'}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999;">
            <p>วันที่ออกเอกสาร: ${new Date().toLocaleDateString('th-TH')}</p>
            <p>ขอบคุณที่ไว้วางใจ Yada Homestay</p>
        </div>
    `;

    try {
        // 3. Render to Canvas
        const canvas = await html2canvas(container, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false
        });

        // 4. Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`receipt_${booking.bookingCode}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
        // 5. Cleanup
        document.body.removeChild(container);
    }
};

// Excel parts remain unchanged, but rewriting the whole file to ensure clean replace
export const exportBookingsToExcel = (bookings: BookingData[], filename = 'bookings'): void => {
    const data = bookings.map(b => ({
        'รหัสการจอง': b.bookingCode,
        'ชื่อผู้จอง': b.guestName,
        'เบอร์โทร': b.guestPhone,
        'วันเช็คอิน': formatDate(b.checkInDate),
        'วันเช็คเอาท์': formatDate(b.checkOutDate),
        'จำนวนคืน': b.nights,
        'ห้องพัก': b.roomName || 'N/A',
        'ยอดรวม': b.totalAmount,
        'ชำระแล้ว': b.paidAmount,
        'สถานะชำระเงิน': b.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระ',
        'สถานะการจอง': getStatusThai(b.status),
        'วันที่จอง': formatDate(b.createdAt)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

    // Auto-width columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportRevenueToExcel = (revenueData: RevenueData[], summary: any, filename = 'revenue_report'): void => {
    // Daily data sheet
    const dailyData = revenueData.map(d => ({
        'วันที่': d.date,
        'รายได้ห้องพัก': d.bookings,
        'รายได้บาร์': d.orders,
        'รายได้รวม': d.total
    }));

    // Summary data
    const summaryData = [
        { 'รายการ': 'รายได้ห้องพักรวม', 'จำนวน (บาท)': summary.totalBookingsRevenue || 0 },
        { 'รายการ': 'รายได้บาร์รวม', 'จำนวน (บาท)': summary.totalOrdersRevenue || 0 },
        { 'รายการ': 'รายได้รวมทั้งหมด', 'จำนวน (บาท)': summary.grandTotal || 0 },
    ];

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(dailyData);
    ws1['!cols'] = [{ wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'รายได้รายวัน');

    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    ws2['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'สรุป');

    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const getStatusThai = (status: string): string => {
    const statusMap: Record<string, string> = {
        'pending': 'รอดำเนินการ',
        'confirmed': 'ยืนยันแล้ว',
        'checked-in': 'เช็คอินแล้ว',
        'checked-out': 'เช็คเอาท์แล้ว',
        'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
};
