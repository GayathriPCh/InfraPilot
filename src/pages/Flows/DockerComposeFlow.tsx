/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const serviceTypes = [
    { id: 'backend', label: 'Backend API', icon: '🔧', description: 'REST API, GraphQL, or backend service' },
    { id: 'frontend', label: 'Frontend App', icon: '🌐', description: 'React, Vue, or static website' },
    { id: 'database', label: 'Database', icon: '🗄️', description: 'PostgreSQL, MySQL, MongoDB' },
    { id: 'cache', label: 'Cache Layer', icon: '⚡', description: 'Redis, Memcached for performance' },
    { id: 'queue', label: 'Message Queue', icon: '📬', description: 'Background job processing' },
    { id: 'proxy', label: 'Load Balancer', icon: '⚖️', description: 'Nginx, Apache for routing' }
];

export default function DockerComposeFlow() {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({});
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const toggleService = (serviceId: string) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(prev => prev.filter(id => id !== serviceId));
            const newDetails = { ...serviceDetails };
            delete newDetails[serviceId];
            setServiceDetails(newDetails);
        } else {
            setSelectedServices(prev => [...prev, serviceId]);
            // Set defaults
            setServiceDetails(prev => ({
                ...prev,
                [serviceId]: {
                    name: '',
                    port: getDefaultPort(serviceId),
                    image: getDefaultImage(serviceId),
                    envVars: {}
                }
            }));
        }
    };

    const updateServiceDetail = (serviceId: string, field: string, value: any) => {
        setServiceDetails(prev => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                [field]: value
            }
        }));
    };

    const getDefaultPort = (serviceId: string) => {
        const ports: Record<string, string> = {
            backend: '3000',
            frontend: '80',
            database: '5432',
            cache: '6379',
            queue: '5672',
            proxy: '80'
        };
        return ports[serviceId] || '8080';
    };

    const getDefaultImage = (serviceId: string) => {
        const images: Record<string, string> = {
            backend: 'node:18-alpine',
            frontend: 'nginx:alpine',
            database: 'postgres:15',
            cache: 'redis:7-alpine',
            queue: 'rabbitmq:3-management',
            proxy: 'nginx:alpine'
        };
        return images[serviceId] || '';
    };

    const handleContinue = () => {
        if (step === 1 && selectedServices.length > 0) {
            setStep(2);
        } else if (step === 2) {
            navigate("/docker-recommendations", {
                state: { selectedServices, serviceDetails }
            });
        }
    };

    const canContinue = selectedServices.length > 0 && (step === 1 || 
        selectedServices.every(serviceId => serviceDetails[serviceId]?.name?.trim()));

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            {/* Back button */}
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Try Our Other Features
                </button>
            </div>
            
            <div className="relative max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Docker Compose Setup
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Create Docker Compose for your services
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {step === 1 
                            ? "Select the services you want to include in your Docker setup" 
                            : "Configure the details for your selected services"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                            Select Services
                        </div>
                        <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                            Configure
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {serviceTypes.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`group cursor-pointer relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                                        selectedServices.includes(service.id)
                                            ? 'border-primary/50 shadow-lg shadow-primary/10'
                                            : 'border-border/50 hover:border-border'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">{service.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1">{service.label}</h3>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            selectedServices.includes(service.id) 
                                                ? 'border-primary bg-primary' 
                                                : 'border-border'
                                        }`}>
                                            {selectedServices.includes(service.id) && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <h3 className="font-semibold text-foreground mb-2">Selected Services:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedServices.map(serviceId => {
                                        const service = serviceTypes.find(s => s.id === serviceId);
                                        return (
                                            <span key={serviceId} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                                {service?.icon} {service?.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        {selectedServices.map((serviceId, index) => {
                            const service = serviceTypes.find(s => s.id === serviceId);
                            if (!service) return null;

                            return (
                                <div key={serviceId} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">{service.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{service.label}</h3>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Service Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={serviceDetails[serviceId]?.name || ''}
                                                onChange={(e) => updateServiceDetail(serviceId, 'name', e.target.value)}
                                                placeholder={`my-${serviceId}`}
                                                className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg 
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                         transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Port
                                            </label>
                                            <input
                                                type="text"
                                                value={serviceDetails[serviceId]?.port || ''}
                                                onChange={(e) => updateServiceDetail(serviceId, 'port', e.target.value)}
                                                placeholder={getDefaultPort(serviceId)}
                                                className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg 
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                         transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Docker Image
                                            </label>
                                            <input
                                                type="text"
                                                value={serviceDetails[serviceId]?.image || ''}
                                                onChange={(e) => updateServiceDetail(serviceId, 'image', e.target.value)}
                                                placeholder={getDefaultImage(serviceId)}
                                                className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg 
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                         transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-4 mt-12">
                    <div className="flex gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-foreground border border-border/50 rounded-xl 
                                         hover:border-border hover:bg-muted/30 transition-all duration-200
                                         flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                     text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                     hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                     active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                     before:absolute before:inset-0 before:rounded-xl 
                                     before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                                     before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {step === 1 ? 'Configure Services' : 'Get Recommendations'}
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                    </p>
                </div>
            </div>
        </div>
    );
}
