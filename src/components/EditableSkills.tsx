import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addSkill, deleteSkill, updateSkill } from "@/lib/slices/studentsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

const PROFICIENCY_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

export default function EditableSkills({ studentId, skills, disabled = false, onSkillAdded, onSkillUpdated }: { studentId: string, skills: any[], disabled?: boolean, onSkillAdded?: () => void, onSkillUpdated?: () => void }) {
  console.log('skills', skills);
  const dispatch = useAppDispatch();
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: "BEGINNER" });
  const [loading, setLoading] = useState(false);
  const [updatingSkillId, setUpdatingSkillId] = useState<string | null>(null);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addSkill({ studentId, data: newSkill })).unwrap();
      setNewSkill({ name: "", proficiency: "BEGINNER" });
      toast.success("Skill added!");
      if (onSkillAdded) onSkillAdded();
    } catch (err) {
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setLoading(true);
    try {
      await dispatch(deleteSkill({ studentId, skillId })).unwrap();
      toast.success("Skill removed!");
    } catch (err) {
      toast.error("Failed to remove skill");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProficiency = async (skillId: string, newProficiency: string) => {
    setUpdatingSkillId(skillId);
    try {
      await dispatch(updateSkill({ studentId, skillId, proficiency: newProficiency })).unwrap();
      toast.success("Skill updated!");
      if (onSkillUpdated) onSkillUpdated();
    } catch (err) {
      toast.error("Failed to update skill");
    } finally {
      setUpdatingSkillId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {skills.map((skill: any, idx: number) => {
          // Fallback for missing id: use name+index
          const key = skill.id || `${skill.name}-${idx}`;
          const canEdit = !!skill.id && !disabled;
          return (
            <div key={key} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
              <span>{skill.name}</span>
              <select
                value={skill.proficiency}
                onChange={e => canEdit && handleUpdateProficiency(skill.id, e.target.value)}
                disabled={updatingSkillId === skill.id || !canEdit}
                className="border rounded px-2 py-1"
              >
                {PROFICIENCY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {!disabled && (
                <Button size="icon" variant="ghost" onClick={() => canEdit && handleDeleteSkill(skill.id)} disabled={loading || !canEdit}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {!disabled && (
        <form onSubmit={handleAddSkill} className="flex gap-2 flex-wrap">
          <Input
            value={newSkill.name}
            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            required
            className="w-50"
          />
          <select
            value={newSkill.proficiency}
            onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })}
            className="border rounded px-2 py-1 w-50"
          >
            {PROFICIENCY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button type="submit" disabled={loading || !newSkill.name} className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10">
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>
      )}
    </div>
  );
} 