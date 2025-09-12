import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ClientTable from "@/components/clients/ClientTable";
import ClientForm from "@/components/clients/ClientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Clients() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Danışanlar</h1>
          <p className="text-sm text-muted-foreground">
            Tüm danışanlarınızı görüntüleyin ve yönetin
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          data-testid="button-new-client"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Danışan
        </Button>
      </div>

      {/* Clients Table */}
      <Card className="p-6">
        <ClientTable />
      </Card>

      {/* Create Client Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Danışan Ekle</DialogTitle>
          </DialogHeader>
          <ClientForm onSuccess={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
