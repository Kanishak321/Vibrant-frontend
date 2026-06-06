"use client";

import { useState } from "react";
import { Store, Receipt, Printer as PrinterIcon, BellRing, Smartphone, Shield, Wallet, CreditCard, ChevronRight, Check, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Restaurant Profile");
  const [isSaved, setIsSaved] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [applyGST, setApplyGST] = useState(true);
  const [levyServiceCharge, setLevyServiceCharge] = useState(false);

  const [printers, setPrinters] = useState([
    { id: 1, name: "Billing Counter Printer", model: "Epson TM-T82III (192.168.1.100)", status: "Online" },
    { id: 2, name: "Kitchen Printer (Hot Section)", model: "TVS RP3200 (192.168.1.101)", status: "Online" }
  ]);
  const [isAddPrinterOpen, setIsAddPrinterOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [gateways, setGateways] = useState({
    razorpay: true,
    phonepe: false,
    pinelabs: false
  });
  const [connectingGateway, setConnectingGateway] = useState<string | null>(null);

  const [aggregators, setAggregators] = useState({
    swiggy: true,
    zomato: true,
    magicpin: false
  });
  const [connectingAggregator, setConnectingAggregator] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    dailySummary: false,
    voidAlerts: true
  });

  const [security, setSecurity] = useState({
    managerPinVoid: true,
    pinClockInOut: false,
    twoFactorAdmin: true
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecurity = (key: keyof typeof security) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConnectGateway = (id: 'razorpay' | 'phonepe' | 'pinelabs') => {
    setConnectingGateway(id);
    setTimeout(() => {
      setGateways(prev => ({ ...prev, [id]: true }));
      setConnectingGateway(null);
    }, 1500);
  };

  const handleDisconnectGateway = (id: 'razorpay' | 'phonepe' | 'pinelabs') => {
    setGateways(prev => ({ ...prev, [id]: false }));
  };

  const handleConnectAggregator = (id: 'swiggy' | 'zomato' | 'magicpin') => {
    setConnectingAggregator(id);
    setTimeout(() => {
      setAggregators(prev => ({ ...prev, [id]: true }));
      setConnectingAggregator(null);
    }, 1500);
  };

  const handleDisconnectAggregator = (id: 'swiggy' | 'zomato' | 'magicpin') => {
    setAggregators(prev => ({ ...prev, [id]: false }));
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword) return;
    setIsPasswordUpdated(true);
    setTimeout(() => {
      setIsPasswordUpdated(false);
      setCurrentPassword("");
      setNewPassword("");
    }, 2000);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground text-sm">Configure your platform, outlets, hardware, and billing preferences.</p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: "Restaurant Profile", icon: Store },
            { id: "Tax & Billing Details", icon: Receipt },
            { id: "Hardware & Printers", icon: PrinterIcon },
            { id: "Payment Gateways", icon: Wallet },
            { id: "Aggregator Integrations", icon: Smartphone },
            { id: "Notifications", icon: BellRing },
            { id: "Security & Passwords", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                {tab.id}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {activeTab === "Restaurant Profile" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Restaurant Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage your brand identity and public information.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden relative group">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Restaurant Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-black text-3xl">V</span>
                      )}
                      {logoUrl && (
                        <div onClick={() => setLogoUrl(null)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <span className="text-white text-xs font-medium">Remove</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label htmlFor="logo-upload" className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors mb-2 inline-flex items-center justify-center cursor-pointer">
                        Upload New Logo
                      </label>
                      <p className="text-xs text-muted-foreground">Recommended size: 512x512px. Max 2MB.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Restaurant Name</label>
                      <input type="text" defaultValue="kcpl Hospitality" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Contact Email</label>
                      <input type="email" defaultValue="admin@kcpl.com" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Contact Phone</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Website URL</label>
                      <input type="url" defaultValue="https://kcpl.com" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Registered Address</label>
                    <textarea rows={3} defaultValue="123, 14th Main Rd, Sector 4, HSR Layout, Bengaluru, Karnataka 560102" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"></textarea>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Tax & Billing Details" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Tax & Billing Details</h3>
                  <p className="text-sm text-muted-foreground">Configure GST, service charges, and billing preferences.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">GSTIN Number</label>
                      <input type="text" defaultValue="29ABCDE1234F1Z5" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">FSSAI License</label>
                      <input type="text" defaultValue="11223344556677" className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Apply GST to Dine-in</p>
                        <p className="text-xs text-muted-foreground">Automatically calculate and apply 5% GST to dine-in orders.</p>
                      </div>
                      <div 
                        onClick={() => setApplyGST(!applyGST)} 
                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${applyGST ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${applyGST ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Levy Service Charge</p>
                        <p className="text-xs text-muted-foreground">Apply a default 10% service charge to the final bill.</p>
                      </div>
                      <div 
                        onClick={() => setLevyServiceCharge(!levyServiceCharge)} 
                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${levyServiceCharge ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${levyServiceCharge ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Hardware & Printers" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Hardware & Printers</h3>
                  <p className="text-sm text-muted-foreground">Manage connected receipt and KOT printers.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {printers.map(printer => (
                      <div key={printer.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <PrinterIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{printer.name}</p>
                            <p className="text-xs text-muted-foreground">{printer.model}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{printer.status}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsAddPrinterOpen(true)}
                    className="h-10 w-full rounded-md border border-dashed border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    + Add New Printer
                  </button>
                </div>
              </>
            )}

            {activeTab === "Aggregator Integrations" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Aggregator Integrations</h3>
                  <p className="text-sm text-muted-foreground">Manage connections with food delivery platforms.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${aggregators.swiggy ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">Swiggy</p>
                      <p className="text-xs text-muted-foreground">Auto-accept orders and sync menu items.</p>
                    </div>
                    {aggregators.swiggy ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectAggregator('swiggy')} className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectAggregator('swiggy')}
                        disabled={connectingAggregator === 'swiggy'}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {connectingAggregator === 'swiggy' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${aggregators.zomato ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">Zomato</p>
                      <p className="text-xs text-muted-foreground">Auto-accept orders and sync menu items.</p>
                    </div>
                    {aggregators.zomato ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectAggregator('zomato')} className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectAggregator('zomato')}
                        disabled={connectingAggregator === 'zomato'}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {connectingAggregator === 'zomato' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${aggregators.magicpin ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-muted/20'}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">Magicpin</p>
                      <p className="text-xs text-muted-foreground">Connect to start receiving orders.</p>
                    </div>
                    {aggregators.magicpin ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectAggregator('magicpin')} className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectAggregator('magicpin')}
                        disabled={connectingAggregator === 'magicpin'}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {connectingAggregator === 'magicpin' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Payment Gateways" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Payment Gateways</h3>
                  <p className="text-sm text-muted-foreground">Configure online and offline payment providers.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${gateways.razorpay ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">R</div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Razorpay</p>
                        <p className="text-xs text-muted-foreground">Used for online ordering and payment links.</p>
                      </div>
                    </div>
                    {gateways.razorpay ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectGateway('razorpay')} className="text-xs font-medium text-red-500 hover:text-red-600">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectGateway('razorpay')} 
                        disabled={connectingGateway === 'razorpay'}
                        className="px-4 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {connectingGateway === 'razorpay' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                  
                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${gateways.phonepe ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">P</div>
                      <div>
                        <p className="text-sm font-bold text-foreground">PhonePe PG</p>
                        <p className="text-xs text-muted-foreground">Zero fee UPI gateway.</p>
                      </div>
                    </div>
                    {gateways.phonepe ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectGateway('phonepe')} className="text-xs font-medium text-red-500 hover:text-red-600">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectGateway('phonepe')} 
                        disabled={connectingGateway === 'phonepe'}
                        className="px-4 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {connectingGateway === 'phonepe' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>

                  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${gateways.pinelabs ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">P</div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Pine Labs EDC</p>
                        <p className="text-xs text-muted-foreground">Card swipe machine integration for billing counter.</p>
                      </div>
                    </div>
                    {gateways.pinelabs ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Connected</span>
                        <button onClick={() => handleDisconnectGateway('pinelabs')} className="text-xs font-medium text-red-500 hover:text-red-600">Disconnect</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnectGateway('pinelabs')} 
                        disabled={connectingGateway === 'pinelabs'}
                        className="px-4 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {connectingGateway === 'pinelabs' ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Notifications" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Configure your preferences for notifications.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">New Order Alerts</p>
                      <p className="text-xs text-muted-foreground">Play a sound and show a banner when a new aggregator order arrives.</p>
                    </div>
                    <div 
                      onClick={() => toggleNotification('newOrders')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifications.newOrders ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.newOrders ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Low Stock Warnings</p>
                      <p className="text-xs text-muted-foreground">Get notified when inventory items fall below the par level.</p>
                    </div>
                    <div 
                      onClick={() => toggleNotification('lowStock')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifications.lowStock ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.lowStock ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Daily Summary Email</p>
                      <p className="text-xs text-muted-foreground">Receive a daily end-of-day sales report email.</p>
                    </div>
                    <div 
                      onClick={() => toggleNotification('dailySummary')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifications.dailySummary ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.dailySummary ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">SMS Alerts for Voided Bills</p>
                      <p className="text-xs text-muted-foreground">Send an immediate SMS to the manager when a bill is voided.</p>
                    </div>
                    <div 
                      onClick={() => toggleNotification('voidAlerts')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifications.voidAlerts ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.voidAlerts ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security & Passwords" && (
              <>
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Security & Passwords</h3>
                  <p className="text-sm text-muted-foreground">Configure access controls and security protocols.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Require PIN for Voids/Discounts</p>
                      <p className="text-xs text-muted-foreground">Manager PIN must be entered to void items or apply custom discounts.</p>
                    </div>
                    <div 
                      onClick={() => toggleSecurity('managerPinVoid')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${security.managerPinVoid ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.managerPinVoid ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Require PIN for Clock-In/Out</p>
                      <p className="text-xs text-muted-foreground">Staff must enter their personal PIN to log attendance.</p>
                    </div>
                    <div 
                      onClick={() => toggleSecurity('pinClockInOut')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${security.pinClockInOut ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.pinClockInOut ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA for Admin Dashboard</p>
                      <p className="text-xs text-muted-foreground">Require Two-Factor Authentication (OTP) to access the web dashboard.</p>
                    </div>
                    <div 
                      onClick={() => toggleSecurity('twoFactorAdmin')} 
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${security.twoFactorAdmin ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.twoFactorAdmin ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Change Admin Password</p>
                    <div className="flex gap-3">
                      <input 
                        type="password" 
                        placeholder="Current Password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm" 
                      />
                      <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm" 
                      />
                      <button 
                        onClick={handleUpdatePassword}
                        disabled={!currentPassword || !newPassword || isPasswordUpdated}
                        className={`h-9 px-4 rounded-md text-sm font-medium border transition-colors inline-flex items-center justify-center min-w-[90px] ${
                          isPasswordUpdated 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-border hover:bg-muted text-foreground disabled:opacity-50"
                        }`}
                      >
                        {isPasswordUpdated ? <><Check className="w-4 h-4 mr-1" /> Updated</> : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="p-6 pt-0 mt-6 border-t border-border flex justify-end gap-3 mt-auto">
              <button className="h-10 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="h-10 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
              >
                {isSaved ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isAddPrinterOpen} onClose={() => setIsAddPrinterOpen(false)} title="Add New Printer">
        <div className="py-6 flex flex-col items-center justify-center space-y-6">
          {isScanning ? (
            <>
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <PrinterIcon className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">Scanning Network...</h3>
                <p className="text-sm text-muted-foreground mt-1">Looking for available ESC/POS printers on your local network (192.168.1.*)</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <PrinterIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">Connect a Printer</h3>
                <p className="text-sm text-muted-foreground mt-1">Ensure your receipt or KOT printer is connected to the same WiFi network.</p>
              </div>
              <button 
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => {
                    setPrinters([...printers, { id: Date.now(), name: "Bar Printer", model: "Epson TM-T20III (192.168.1.105)", status: "Online" }]);
                    setIsScanning(false);
                    setIsAddPrinterOpen(false);
                  }, 2500);
                }}
                className="h-10 px-6 w-full max-w-xs rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Scan for Printers
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}