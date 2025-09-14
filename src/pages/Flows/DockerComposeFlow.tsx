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
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to InfraPilot
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-bold">🐳</span>
                        </div>
                        <div className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Docker Compose Builder
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></div>
                        </div>
                        Docker Compose Generator
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Container orchestration
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                            made intelligent
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {step === 1 
                            ? "Select your services and let AI generate the perfect Docker Compose configuration" 
                            : "Fine-tune your service configurations with intelligent defaults"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                            step >= 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800/50 text-slate-500'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</span>
                            Select Services
                        </div>
                        <div className={`w-12 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-700'}`} />
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                            step >= 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800/50 text-slate-500'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">2</span>
                            Configure Details
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serviceTypes.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`group cursor-pointer relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                                        selectedServices.includes(service.id)
                                            ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 shadow-xl shadow-blue-500/25'
                                            : 'bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{service.label}</h3>
                                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{service.description}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                            selectedServices.includes(service.id) 
                                                ? 'border-blue-400 bg-blue-500 shadow-lg shadow-blue-500/50' 
                                                : 'border-slate-600 group-hover:border-slate-500'
                                        }`}>
                                            {selectedServices.includes(service.id) && (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-blue-400">🎯</span>
                                    Selected Services
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedServices.map(serviceId => {
                                        const service = serviceTypes.find(s => s.id === serviceId);
                                        return (
                                            <span key={serviceId} className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm flex items-center gap-2 font-medium">
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
                    <div className="space-y-8">
                        {selectedServices.map((serviceId, index) => {
                            const service = serviceTypes.find(s => s.id === serviceId);
                            if (!service) return null;

                            return (
                                <div key={serviceId} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                                                <span className="text-2xl">{service.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white">{service.label}</h3>
                                                <p className="text-slate-400">{service.description}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                                                    {index + 1} of {selectedServices.length}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                                    Service Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={serviceDetails[serviceId]?.name || ''}
                                                    onChange={(e) => updateServiceDetail(serviceId, 'name', e.target.value)}
                                                    placeholder={`my-${serviceId}`}
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                                             text-white placeholder:text-slate-500
                                                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                                             hover:border-slate-600/50 transition-all duration-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                                    Port
                                                </label>
                                                <input
                                                    type="text"
                                                    value={serviceDetails[serviceId]?.port || ''}
                                                    onChange={(e) => updateServiceDetail(serviceId, 'port', e.target.value)}
                                                    placeholder={getDefaultPort(serviceId)}
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                                             text-white placeholder:text-slate-500
                                                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                                             hover:border-slate-600/50 transition-all duration-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                                    Docker Image
                                                </label>
                                                <input
                                                    type="text"
                                                    value={serviceDetails[serviceId]?.image || ''}
                                                    onChange={(e) => updateServiceDetail(serviceId, 'image', e.target.value)}
                                                    placeholder={getDefaultImage(serviceId)}
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                                             text-white placeholder:text-slate-500
                                                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                                                             hover:border-slate-600/50 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-6 mt-16">
                    <div className="flex gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white 
                                         border border-slate-700/50 rounded-xl hover:border-slate-600/50 
                                         hover:bg-slate-800/30 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Selection
                            </button>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 
                                     hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl 
                                     shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40
                                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                     disabled:shadow-none"
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                <span className="text-lg">🐳</span>
                                {step === 1 ? 'Configure Services' : 'Generate Docker Compose'}
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Progress indicator */}
                    <div className="text-center">
                        <p className="text-slate-500 text-sm mb-2">
                            {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                        </p>
                        {step === 2 && (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-32 bg-slate-800 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${(selectedServices.filter(id => serviceDetails[id]?.name?.trim()).length / selectedServices.length) * 100}%` 
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500">
                                    {selectedServices.filter(id => serviceDetails[id]?.name?.trim()).length}/{selectedServices.length} configured
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature preview */}
                {step === 1 && (
                    <div className="mt-20 text-center">
                        <p className="text-slate-500 text-sm mb-6">What you'll get</p>
                        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50">
                                <div className="text-3xl mb-3">📋</div>
                                <h3 className="font-medium text-white mb-2">Complete docker-compose.yml</h3>
                                <p className="text-xs text-slate-500">Production-ready configuration with all services</p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50">
                                <div className="text-3xl mb-3">🔧</div>
                                <h3 className="font-medium text-white mb-2">Smart Defaults</h3>
                                <p className="text-xs text-slate-500">Intelligent port mapping and environment setup</p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50">
                                <div className="text-3xl mb-3">🚀</div>
                                <h3 className="font-medium text-white mb-2">Ready to Deploy</h3>
                                <p className="text-xs text-slate-500">One-command deployment instructions</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
