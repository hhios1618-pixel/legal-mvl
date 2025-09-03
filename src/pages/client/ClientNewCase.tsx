import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, eventBus } from '../../store';
import { ServiceType, Priority, SERVICE_LABELS } from '../../types';
import { CHECKLIST } from '../../data';
import { X, ArrowRight, CheckCircle } from 'lucide-react';

const ClientNewCase: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, createCase } = useApp();
  
  const [formData, setFormData] = useState({
    type: '' as ServiceType,
    title: '',
    description: '',
    priority: 'media' as Priority
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title || !formData.description) return;

    setIsSubmitting(true);

    try {
      const newCase = createCase({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        clientId: currentUser.id
      });

      // Mostrar toast de éxito
      eventBus.emit('toast', {
        type: 'success',
        title: 'Caso creado exitosamente',
        message: `Su caso "${newCase.title}" ha sido creado y será asignado a un abogado especializado.`
      });

      // Redirigir al detalle del caso
      navigate(`/cliente/casos/${newCase.id}`);
    } catch (error) {
      eventBus.emit('toast', {
        type: 'error',
        title: 'Error al crear caso',
        message: 'Hubo un problema al crear su caso. Por favor, inténtelo nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = Object.entries(SERVICE_LABELS) as [ServiceType, string][];
  const priorities: { value: Priority; label: string; description: string }[] = [
    { value: 'baja', label: 'Baja', description: 'No hay urgencia especial' },
    { value: 'media', label: 'Media', description: 'Requiere atención en tiempo normal' },
    { value: 'alta', label: 'Alta', description: 'Requiere atención prioritaria' },
    { value: 'urgente', label: 'Urgente', description: 'Requiere atención inmediata' }
  ];

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'baja': return 'from-emerald-600 to-emerald-700';
      case 'media': return 'from-amber-600 to-amber-700';
      case 'alta': return 'from-orange-600 to-orange-700';
      case 'urgente': return 'from-red-600 to-red-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Caso</h1>
            <p className="text-gray-600">
              Complete la información para crear una nueva solicitud legal
            </p>
          </div>
          <button
            onClick={() => navigate('/cliente')}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Paso {currentStep} de 3</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Service Type */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seleccione el tipo de servicio legal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceTypes.map(([type, label]) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, type })}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      formData.type === type
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-medium mb-2">{label}</div>
                    <div className="text-sm text-gray-500">
                      {CHECKLIST[type]?.slice(0, 2).join(', ')}...
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {formData.type && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Step 2: Case Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles del caso
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  ← Volver
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título del caso *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: Constitución de sociedad anónima"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción detallada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describa detalladamente su situación legal, incluyendo antecedentes relevantes, objetivos y cualquier información que considere importante..."
                  required
                />
              </div>

              {formData.type && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-blue-700 font-semibold mb-2">
                    Documentos típicamente requeridos para {SERVICE_LABELS[formData.type]}:
                  </h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {CHECKLIST[formData.type]?.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.title && formData.description && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: Priority */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prioridad del caso
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  ← Volver
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorities.map((priority) => (
                  <motion.button
                    key={priority.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      formData.priority === priority.value
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(priority.value)}`} />
                      <span className="font-medium">{priority.label}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {priority.description}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-gray-900 font-semibold mb-3">Resumen del caso:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="text-gray-900">{SERVICE_LABELS[formData.type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Título:</span>
                    <span className="text-gray-900 truncate ml-4">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prioridad:</span>
                    <span className="text-gray-900 capitalize">{formData.priority}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/cliente')}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Crear Caso <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ClientNewCase;


