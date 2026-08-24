import ProjectManager from "@/components/ProjectManager";

export default function MaintenancePage() {
  return (
    <ProjectManager
      type="maintenance"
      title="Maintenance Projects"
      subtitle="Create and manage maintenance projects. Details can be edited anytime after a project is added. Click any row to view details."
    />
  );
}
