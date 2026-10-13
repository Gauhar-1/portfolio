'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestone, Plus, Trash2 } from 'lucide-react';
import type { ArchitectureFormValues } from '@/validations/architectureSchema';

interface RoadmapFieldArrayProps {
  form: UseFormReturn<ArchitectureFormValues>;
}

export function RoadmapFieldArray({ form }: RoadmapFieldArrayProps) {
  const { register, control, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roadmap',
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <Milestone className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Section 04</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Future Architecture Roadmap</CardTitle>
            <CardDescription>
              Chronological milestones and planned scalability evolutions displayed in the timeline section.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                phase: `Phase ${fields.length + 1}`,
                title: '',
                description: '',
              })
            }
            className="gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {errors.roadmap?.root && (
          <p className="text-xs text-destructive">{errors.roadmap.root.message}</p>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => {
              const itemErrors = errors.roadmap?.[index];

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-xl border border-border bg-muted/20 p-4 sm:p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                      Milestone #{index + 1}
                    </span>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove Milestone</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Phase Label <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Phase 1, Phase 2, Q3 2025"
                        {...register(`roadmap.${index}.phase` as const)}
                        className={itemErrors?.phase ? 'border-destructive' : ''}
                      />
                      {itemErrors?.phase && (
                        <p className="text-[11px] text-destructive">{itemErrors.phase.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Milestone Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Decentralized Multi-Tenant Edge Ingestion"
                        {...register(`roadmap.${index}.title` as const)}
                        className={itemErrors?.title ? 'border-destructive' : ''}
                      />
                      {itemErrors?.title && (
                        <p className="text-[11px] text-destructive">{itemErrors.title.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Milestone Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="e.g. Deploying distributed edge workers to handle real-time kitchen display sync with sub-5ms localized latency..."
                      {...register(`roadmap.${index}.description` as const)}
                      className={itemErrors?.description ? 'border-destructive' : ''}
                    />
                    {itemErrors?.description && (
                      <p className="text-[11px] text-destructive">{itemErrors.description.message}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
