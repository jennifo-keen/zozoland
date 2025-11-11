import React, { useState } from "react";
import Modal from "react-modal";
import QRCode from "react-qr-code";
import "./ticketlist.css";

Modal.setAppElement(document.getElementById("root") || document.body);

export default function TicketList({ tickets: orders, userId }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tickets, setTickets] = useState([]);

  const openModal = async (order) => {
    try {
      const res = await fetch(`http://localhost:4000/api/userinfo/${userId}/orders/${order._id}/tickets`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.warn("API không trả về mảng vé:", data);
        setTickets([]);
      }

      setSelectedOrder(order);
    } catch (err) {
      console.error("Lỗi khi lấy vé:", err);
      setTickets([]);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setTickets([]);
  };

  return (
    <div className="ticket-list">
      <h2>Vé của tôi</h2>
      <p className="subtitle">Danh sách các đơn hàng đã tạo</p>

      <div className="ticket-grid">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="ticket-order">
              <div><strong>Mã đơn hàng:</strong> {order._id}</div>
              <div><strong>Ngày đi:</strong> {new Date(order.visitDate).toLocaleDateString()}</div>
              <div><strong>Trạng thái:</strong> {order.status}</div>
              <div><strong>Tổng tiền:</strong> {order.pricing?.totalPayable?.toLocaleString()} {order.pricing?.currency || "VND"}</div>
              <hr style={{ margin: "12px 0", borderTop: "1px solid #ccc" }} />

              <button className="qr-button" onClick={() => openModal(order)}>
                Xem chi tiết đơn hàng
              </button>
            </div>
          ))
        ) : (
          <p className="no-tickets">Bạn chưa có đơn đặt vé nào.</p>
        )}
      </div>

      {selectedOrder && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          contentLabel="Chi tiết đơn hàng"
          className="modal"
          overlayClassName="overlay"
        >
          <h3>Chi tiết đơn hàng</h3>
          <p><strong>Mã đơn:</strong> {selectedOrder._id}</p>
          <p><strong>Ngày đi:</strong> {new Date(selectedOrder.visitDate).toLocaleDateString()}</p>

          {tickets.length > 0 ? (
            <div className="ticket-subgrid">
              {tickets.map((ticket, index) => (
                <div key={ticket._id || index} className="ticket-card">
                  <p><strong>Loại vé:</strong> {ticket.categoryCode}</p>
                  <p><strong>Ngày đi:</strong> {ticket.visitDate ? new Date(ticket.visitDate).toLocaleDateString() : "Không có"}</p>
                  <p><strong>Trạng thái:</strong> {ticket.status}</p>
                  <p><strong>Ngày tạo:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Không có"}</p>

                  {typeof ticket.qrCode === "string" && ticket.qrCode.trim() !== "" ? (
                    <>
                      <QRCode value={ticket.qrCode} size={96} />

                      <p className="qr-label">{ticket.qrCode}</p>
                    </>
                  ) : (
                    <p className="qr-label">Không có mã QR</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tickets">Không tìm thấy vé nào cho đơn này.</p>
          )}

          <button className="qr-button" onClick={closeModal}>Đóng</button>
        </Modal>
      )}
    </div>
  );
}