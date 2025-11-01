"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function VendorRegisterConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
            <h1 className="neo-heading text-4xl md:text-6xl mb-4">
              APPLICATION <span className="text-green-500">SUBMITTED</span>
            </h1>
            <p className="neo-text text-xl text-gray-600">
              YOUR VENDOR APPLICATION HAS BEEN RECEIVED
            </p>
          </div>

          <div className="space-y-6 mb-8 text-left">
            <div className="bg-yellow-400 p-6 neo-border">
              <h2 className="neo-heading text-xl mb-3">WHAT HAPPENS NEXT?</h2>
              <ul className="space-y-2 neo-text">
                <li>• OUR ADMIN TEAM WILL REVIEW YOUR APPLICATION</li>
                <li>• YOU'LL RECEIVE AN EMAIL NOTIFICATION ONCE APPROVED</li>
                <li>• AFTER APPROVAL, YOU CAN START LISTING YOUR AI AGENTS</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 neo-border">
              <h3 className="neo-heading text-lg mb-2">EXPECTED REVIEW TIME</h3>
              <p className="neo-text text-gray-600">
                APPLICATIONS ARE TYPICALLY REVIEWED WITHIN 24-48 HOURS. YOU'LL BE NOTIFIED VIA EMAIL ONCE YOUR APPLICATION STATUS CHANGES.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                CONTINUE SHOPPING
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button size="lg" className="bg-yellow-400 text-black">
                GO TO ACCOUNT
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

