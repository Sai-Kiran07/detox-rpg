package rpg.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String stage;
    private String priority;
    private String recurrence;
    private String attribute;

    private Integer attributeGain;
    private Integer rewardXp;
    private Integer rewardScore;
    private Integer rewardTickets;

    private Boolean completed;

    private String deadline;

    @ElementCollection
    @Builder.Default
    private List<Subtask> subtasks = new ArrayList<>();

    @ManyToOne
    private User user;
}