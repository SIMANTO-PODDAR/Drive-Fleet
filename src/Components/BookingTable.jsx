import { Table } from "@heroui/react";

export function BookingTable({ bookingData }) {
    return (
        <Table className="min-w-75 max-w-175 mx-auto mt-4">
            <Table.ScrollContainer >
                <Table.Content aria-label="Team members">
                    <Table.Header>
                        <Table.Column isRowHeader>Car Name</Table.Column>
                        <Table.Column>Total Price $</Table.Column>
                        <Table.Column>Booking Date</Table.Column>
                        <Table.Column>Driver Needed</Table.Column>
                    </Table.Header>
                    <Table.Body>

                        {bookingData.map((data, ind) =>
                            < Table.Row key={ind}>
                                <Table.Cell>{data.CarName}</Table.Cell>
                                <Table.Cell>{data.TotalPrice}</Table.Cell>
                                <Table.Cell>{new Date(data.BookingDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{data.DriverNeeded}</Table.Cell>
                            </ Table.Row>
                        )}

                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table >
    );
}