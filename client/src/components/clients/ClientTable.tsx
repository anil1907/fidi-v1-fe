import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useClients, useClientMutations } from "@/lib/hooks/useClients";
import { calculateAge } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { Client } from "@shared/schema";

interface ClientTableProps {
  limit?: number;
  onEditClient?: (client: Client) => void;
}

export default function ClientTable({ limit, onEditClient }: ClientTableProps) {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  
  const { data, isLoading } = useClients({ 
    search, 
    page, 
    pageSize: limit || 10 
  });
  const { deleteClient } = useClientMutations();

  const clients = data?.clients || [];
  const total = data?.total || 0;

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (clients.length === 0 && !search) {
    return (
      <EmptyState
        title="Henüz danışan yok"
        description="İlk danışanınızı ekleyerek başlayın"
      />
    );
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ad, email veya telefon ile ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-client-search"
              />
            </div>
          </div>
          <Select>
            <SelectTrigger className="w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Tüm Durumlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
              <SelectItem value="completed">Tamamlanmış</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {!limit && (
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
              )}
              <TableHead>Danışan</TableHead>
              <TableHead>İletişim</TableHead>
              <TableHead>Yaş</TableHead>
              <TableHead>Aktif Plan</TableHead>
              <TableHead>Son Randevu</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: any) => (
              <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                {!limit && (
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {client.firstName[0]}{client.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`text-client-name-${client.id}`}>
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {client.goals?.join(", ") || "Hedef belirlenmemiş"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm" data-testid={`text-client-email-${client.id}`}>
                      {client.email || "Email yok"}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-client-phone-${client.id}`}>
                      {client.phone || "Telefon yok"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {client.birthDate ? calculateAge(client.birthDate) : "Bilinmiyor"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    Plan atanmamış
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    Henüz randevu yok
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    Beklemede
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      data-testid={`button-view-client-${client.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditClient?.(client)}
                      data-testid={`button-edit-client-${client.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setDeleteClientId(client.id)}
                      data-testid={`button-delete-client-${client.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!limit && total > 10 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            1-{Math.min(10, total)} / {total} danışan gösteriliyor
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Önceki
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              Sonraki
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteClientId}
        onClose={() => setDeleteClientId(null)}
        onConfirm={async () => {
          if (deleteClientId) {
            try {
              await deleteClient.mutateAsync(deleteClientId);
              setDeleteClientId(null);
            } catch (error) {
              console.error("Failed to delete client:", error);
            }
          }
        }}
        title="Danışanı sil"
        description="Bu danışanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}
