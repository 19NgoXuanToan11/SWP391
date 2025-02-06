import React from "react";
import { Card, Image } from "antd";
import qrImage from "../../assets/pictures/qr.png";

function QRPaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <div className="text-center">
            <Image
              src={qrImage}
              alt="QR Code"
              width={300}
              preview={false}
              className="rounded-lg"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default QRPaymentPage;
