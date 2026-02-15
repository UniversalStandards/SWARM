'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { WORKFLOW_TEMPLATES } from '@/lib/workflows/templates';

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (templateIndex: number) => {
    // TODO: Create workflow from template
    console.log('Using template:', templateIndex);
    router.push('/workflows/create');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Workflow Templates</h1>
        <p className="text-gray-400">Start with pre-configured workflow templates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKFLOW_TEMPLATES.map((template, index) => {
          const agentTypes = Array.from(
            new Set(
              template.nodes
                .filter(n => n.type === 'agent')
                .map(n => n.data.agentType)
                .filter(Boolean)
            )
          );

          return (
            <TemplateCard
              key={index}
              name={template.name}
              description={template.description}
              nodeCount={template.nodes.length}
              agentTypes={agentTypes}
              onUse={() => handleUseTemplate(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
