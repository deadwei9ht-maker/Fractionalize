
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ShieldAlert, Terminal } from 'lucide-react';

type WalletActivity = {
  id: string; // The wallet address
  connectionCount: number;
  lastConnectionAt: string;
  flagged: boolean;
};

export function WalletActivityLog() {
  const { user } = useUser();
  const { data: activities, loading } = useCollection<WalletActivity>('walletActivity', {
    deps: [user],
  });

  const sortedActivities = useMemo(() => {
    if (!activities) return [];
    return [...activities].sort((a, b) => new Date(b.lastConnectionAt).getTime() - new Date(a.lastConnectionAt).getTime());
  }, [activities]);

  if (!user) {
    return null;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      );
    }

    if (!sortedActivities || sortedActivities.length === 0) {
      return (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No activity yet!</AlertTitle>
          <AlertDescription>
            Wallet connection activity will appear here once users connect.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <ScrollArea className="h-[250px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead className="text-center">Connections</TableHead>
              <TableHead className="text-right">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedActivities.map((activity) => (
              <TableRow key={activity.id} className={activity.flagged ? 'bg-destructive/10' : ''}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {activity.flagged && <ShieldAlert className="h-4 w-4 text-destructive" />}
                    <span className="font-mono text-sm">
                        {`${activity.id.slice(0, 8)}...${activity.id.slice(-6)}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant={activity.flagged ? 'destructive' : 'secondary'}>
                        {activity.connectionCount}
                    </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.lastConnectionAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
  };

  return (
    <Card className="w-full border-accent/20 bg-card/50">
      <CardHeader>
        <CardTitle>Wallet Connection Log</CardTitle>
        <CardDescription>
          Live feed of wallet connections and flagged activity.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
