import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Trash2, CheckCircle, Circle, Tag, Search, Filter } from 'lucide-react';
import { Prayer } from '../types';

const Journal: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { prayers, addPrayer, deletePrayer, togglePrayerAnswered } = context;

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPrayer: Prayer = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      tags: ['Geral'], // Mock tags for now
      createdAt: new Date().toISOString(),
      isAnswered: false,
    };

    addPrayer(newPrayer);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const filteredPrayers = prayers.filter(p => {
    if (filter === 'active') return !p.isAnswered;
    if (filter === 'answered') return p.isAnswered;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto bg-stone-50 dark:bg-black/20">
      <div className="max-w-4xl mx-auto px-4 py-8 md:p-10 min-h-full flex flex-col">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-stone-900 dark:text-stone-100 mb-1">Diário de Oração</h1>
            <p className="text-stone-500 dark:text-stone-400 font-serif italic text-sm">"Orai sem cessar." (1 Tessalonicenses 5:17)</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="font-medium">Nova Oração</span>
          </button>
        </div>

        {/* Creation Form Overlay/Inline */}
        {isCreating && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-lg border border-gold-200 dark:border-stone-700">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Título da intenção..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-lg font-display font-semibold placeholder:text-stone-300 border-none focus:ring-0 p-0 bg-transparent text-stone-900 dark:text-stone-100"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Escreva sua oração aqui..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full resize-none border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 rounded-lg p-3 text-stone-700 dark:text-stone-300 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all font-serif"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-6 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
           <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'}`}
           >
             Todas
           </button>
           <button 
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'active' ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'}`}
           >
             Ativas
           </button>
           <button 
            onClick={() => setFilter('answered')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'answered' ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'}`}
           >
             Respondidas
           </button>
        </div>

        {/* List */}
        {filteredPrayers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 p-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
               <Tag className="text-stone-400" size={24} />
            </div>
            <p className="text-stone-500 font-medium">Nenhuma oração encontrada nesta categoria.</p>
            <button onClick={() => setIsCreating(true)} className="text-gold-600 hover:underline text-sm mt-2">
              Adicionar primeira oração
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrayers.map(prayer => (
              <div 
                key={prayer.id} 
                className={`
                  group relative bg-white dark:bg-stone-900 p-5 rounded-xl border transition-all duration-300 hover:shadow-md
                  ${prayer.isAnswered ? 'border-green-200 dark:border-green-900/30 bg-green-50/30' : 'border-stone-200 dark:border-stone-800'}
                `}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-display font-semibold text-lg text-stone-900 dark:text-stone-100 ${prayer.isAnswered ? 'line-through decoration-stone-400 opacity-60' : ''}`}>
                    {prayer.title}
                  </h3>
                  <button 
                    onClick={() => togglePrayerAnswered(prayer.id)}
                    className={`p-1 rounded-full transition-colors ${prayer.isAnswered ? 'text-green-600 bg-green-100 dark:bg-green-900/50' : 'text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                    title={prayer.isAnswered ? "Marcar como não respondida" : "Marcar como respondida"}
                  >
                    {prayer.isAnswered ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                </div>
                
                <p className="text-stone-600 dark:text-stone-400 font-serif text-sm leading-relaxed mb-4 line-clamp-3">
                  {prayer.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-xs text-stone-400">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </span>
                  
                  <button 
                    onClick={() => deletePrayer(prayer.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir oração"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Journal;